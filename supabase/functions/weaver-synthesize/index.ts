// Recursive synthesis: takes a query, retrieves semantically-similar chunks,
// asks the LLM to weave a higher-order insight, and stores it.
// Body: { query: string, kind?: "summary"|"bridge"|"gap", k?: number }
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const EMBED_MODEL = "openai/text-embedding-3-small";
const CHAT_MODEL = "google/gemini-2.5-flash";

async function embedOne(text: string): Promise<number[]> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!r.ok) throw new Error(`embed ${r.status}: ${await r.text()}`);
  return (await r.json()).data[0].embedding;
}

async function chat(system: string, user: string) {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  if (!r.ok) throw new Error(`chat ${r.status}: ${await r.text()}`);
  const json = await r.json();
  return json.choices[0].message.content as string;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  summary: "You are a synthesizer. Given excerpts from a knowledge corpus, produce a tight, structured summary highlighting the core argument and its implications. Output JSON: {\"title\": string, \"body\": string}.",
  bridge: "You are a conceptual bridge engineer. Given excerpts from disparate sources, identify the strongest non-obvious connection between them and articulate it as a bridge concept. Output JSON: {\"title\": string, \"body\": string}.",
  gap: "You are a gap analyst. Given excerpts, identify the most important missing concept or unanswered question implied but not addressed. Output JSON: {\"title\": string, \"body\": string}.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  let runId: string | undefined;
  try {
    const { query, kind = "summary", k = 8 } = await req.json();
    if (!query || typeof query !== "string") throw new Error("query required");
    if (!SYSTEM_PROMPTS[kind]) throw new Error(`unknown kind: ${kind}`);

    const run = await admin.from("synthesis_runs").insert({
      phase: "synthesis",
      status: "running",
      input: { query, kind, k },
      started_at: new Date().toISOString(),
    }).select().single();
    if (run.error) throw new Error(run.error.message);
    runId = run.data.id;

    const qvec = await embedOne(query);
    const { data: matches, error: mErr } = await admin.rpc("match_chunks", {
      query_embedding: qvec as unknown as string,
      match_count: k,
    });
    if (mErr) throw new Error(`match: ${mErr.message}`);
    const chunks = (matches ?? []) as Array<{ id: string; content: string; similarity: number }>;
    if (chunks.length === 0) throw new Error("no chunks indexed yet — upload documents first");

    const context = chunks
      .map((c, i) => `[${i + 1}] (similarity ${c.similarity.toFixed(3)})\n${c.content}`)
      .join("\n\n");
    const raw = await chat(
      SYSTEM_PROMPTS[kind],
      `Query: ${query}\n\nExcerpts:\n${context}\n\nReturn only JSON.`,
    );
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: query, body: raw };

    const insight = await admin.from("insights").insert({
      run_id: runId,
      kind,
      title: parsed.title ?? query,
      body: parsed.body ?? raw,
      source_chunk_ids: chunks.map((c) => c.id),
      metadata: { model: CHAT_MODEL, query },
    }).select().single();
    if (insight.error) throw new Error(insight.error.message);

    await admin.from("synthesis_runs").update({
      status: "complete", progress: 100,
      output: { insight_id: insight.data.id, matched: chunks.length },
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    return new Response(JSON.stringify({ ok: true, insight: insight.data, matched: chunks.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("weaver-synthesize error", msg);
    if (runId) {
      await admin.from("synthesis_runs").update({
        status: "failed", error: msg, completed_at: new Date().toISOString(),
      }).eq("id", runId);
    }
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});