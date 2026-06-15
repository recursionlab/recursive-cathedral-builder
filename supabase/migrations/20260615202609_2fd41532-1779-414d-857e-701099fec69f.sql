
create extension if not exists vector;

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  storage_path text not null,
  mime_type text,
  byte_size bigint,
  status text not null default 'pending',
  error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.documents to anon;
grant select, insert, update, delete on public.documents to authenticated;
grant all on public.documents to service_role;
alter table public.documents enable row level security;
create policy "documents are public readable" on public.documents for select using (true);
create policy "users insert own documents" on public.documents for insert to authenticated with check (auth.uid() = user_id or user_id is null);
create policy "users update own documents" on public.documents for update to authenticated using (auth.uid() = user_id);
create policy "users delete own documents" on public.documents for delete to authenticated using (auth.uid() = user_id);

create table public.chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  token_count int,
  embedding vector(1536),
  cluster_id int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index chunks_document_idx on public.chunks(document_id);
create index chunks_cluster_idx on public.chunks(cluster_id);
create index chunks_embedding_idx on public.chunks using hnsw (embedding vector_cosine_ops);
grant select on public.chunks to anon;
grant select, insert, update, delete on public.chunks to authenticated;
grant all on public.chunks to service_role;
alter table public.chunks enable row level security;
create policy "chunks are public readable" on public.chunks for select using (true);
create policy "service writes chunks" on public.chunks for all to service_role using (true) with check (true);

create table public.synthesis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  phase text not null,
  status text not null default 'pending',
  progress int not null default 0,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index synthesis_runs_phase_idx on public.synthesis_runs(phase, created_at desc);
grant select on public.synthesis_runs to anon;
grant select, insert, update, delete on public.synthesis_runs to authenticated;
grant all on public.synthesis_runs to service_role;
alter table public.synthesis_runs enable row level security;
create policy "runs are public readable" on public.synthesis_runs for select using (true);
create policy "users insert own runs" on public.synthesis_runs for insert to authenticated with check (auth.uid() = user_id or user_id is null);
create policy "service manages runs" on public.synthesis_runs for all to service_role using (true) with check (true);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.synthesis_runs(id) on delete set null,
  kind text not null,
  title text not null,
  body text not null,
  source_chunk_ids uuid[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index insights_kind_idx on public.insights(kind, created_at desc);
grant select on public.insights to anon;
grant select, insert, update, delete on public.insights to authenticated;
grant all on public.insights to service_role;
alter table public.insights enable row level security;
create policy "insights are public readable" on public.insights for select using (true);
create policy "service manages insights" on public.insights for all to service_role using (true) with check (true);

create or replace function public.match_chunks(query_embedding vector(1536), match_count int default 8)
returns table (id uuid, document_id uuid, content text, similarity float)
language sql stable security definer set search_path = public as $$
  select c.id, c.document_id, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.chunks c
  where c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
grant execute on function public.match_chunks(vector, int) to anon, authenticated, service_role;

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger documents_touch before update on public.documents for each row execute function public.touch_updated_at();
