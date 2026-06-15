
-- 1. Restrict SECURITY DEFINER functions
revoke execute on function public.match_chunks(vector, int) from anon, authenticated, public;
grant execute on function public.match_chunks(vector, int) to service_role;

-- 2. Pin search_path on helper
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.match_chunks(query_embedding vector(1536), match_count int default 8)
returns table (id uuid, document_id uuid, content text, similarity float)
language sql stable security definer set search_path = public as $$
  select c.id, c.document_id, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  where c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
revoke execute on function public.match_chunks(vector, int) from anon, authenticated, public;
grant execute on function public.match_chunks(vector, int) to service_role;

-- 3. Move vector extension out of public
create schema if not exists extensions;
grant usage on schema extensions to anon, authenticated, service_role;
alter extension vector set schema extensions;

-- 4. Storage RLS for the "documents" bucket
create policy "users upload own documents"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users read own documents"
on storage.objects for select to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users delete own documents"
on storage.objects for delete to authenticated
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "service reads all documents"
on storage.objects for select to service_role
using (bucket_id = 'documents');
