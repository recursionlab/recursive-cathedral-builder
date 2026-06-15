// Ingest a document from storage: parse, chunk, embed, store.
// Invoke with { documentId }. The document row must already exist with status='pending'.
import { createClient } from "npm:@supabase/supabase-js@2";
import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.12.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const EMBED_MODEL = "openai/text-embedding-3-small";

function chunkText(text: string, target = 900, overlap = 150): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const chunks: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    const end = Math.min(i + target, cleaned.length);
    // try to break at a sentence boundary near the end
    let sliceEnd = end;
    if (end < cleaned.length) {
      const dot = cleaned.lastIndexOf(". ", end);
      if (dot > i + target * 0.6) sliceEnd = dot + 1;
    }
    chunks.push(cleaned.slice(i, sliceEnd).trim());
    if (sliceEnd >= cleaned.length) break;
    i = Math.max(sliceEnd - overlap, i + 1);
  }
  return chunks.filter((c) => c.length > 40);
}

async function embedBatch(inputs: string[]): Promise<number[][]> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: inputs }),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Embedding ${r.status}: ${txt}`);
  }
  const json = await r.json();
  return json.data.map((d: { embedding: number[] }) => d.embedding);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  let documentId: string | undefined;
  try {
    const body = await req.json();
    documentId = body.documentId;
    if (!documentId) throw new Error("documentId required");

    const { data: doc, error: docErr } = await admin
      .from("documents").select("*").eq("id", documentId).single();
    if (docErr || !doc) throw new Error(docErr?.message ?? "document not found");

    await admin.from("documents").update({ status: "parsing" }).eq("id", documentId);

    const { data: file, error: dlErr } = await admin.storage
      .from("documents").download(doc.storage_path);
    if (dlErr || !file) throw new Error(`download failed: ${dlErr?.message}`);

    let text = "";
    const buf = new Uint8Array(await file.arrayBuffer());
    if ((doc.mime_type ?? "").includes("pdf") || doc.storage_path.endsWith(".pdf")) {
      const pdf = await getDocumentProxy(buf);
      const out = await extractText(pdf, { mergePages: true });
      text = Array.isArray(out.text) ? out.text.join("\n") : out.text;
    } else {
      text = new TextDecoder().decode(buf);
    }

    const chunks = chunkText(text);
    if (chunks.length === 0) throw new Error("no extractable text");

    await admin.from("documents").update({ status: "embedding" }).eq("id", documentId);

    // batch embed (small batches keep token usage safe)
    const BATCH = 16;
    const rows: Array<{ document_id: string; chunk_index: number; content: string; embedding: number[]; token_count: number }> = [];
    for (let i = 0; i < chunks.length; i += BATCH) {
      const slice = chunks.slice(i, i + BATCH);
      const vectors = await embedBatch(slice);
      slice.forEach((content, j) => {
        rows.push({
          document_id: documentId!,
          chunk_index: i + j,
          content,
          embedding: vectors[j],
          token_count: Math.ceil(content.length / 4),
        });
      });
    }

    // insert in waves of 50
    for (let i = 0; i < rows.length; i += 50) {
      const wave = rows.slice(i, i + 50);
      const { error } = await admin.from("chunks").insert(wave);
      if (error) throw new Error(`chunk insert: ${error.message}`);
    }

    await admin.from("documents")
      .update({ status: "ready", metadata: { ...doc.metadata, chunk_count: rows.length } })
      .eq("id", documentId);

    return new Response(JSON.stringify({ ok: true, chunks: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("ingest-document error", msg);
    if (documentId) {
      await admin.from("documents").update({ status: "failed", error: msg }).eq("id", documentId);
    }
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});