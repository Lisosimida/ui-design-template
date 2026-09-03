-- resumes: one row per uploaded resume, owned by the uploading user.
-- Ticket #3 (auth foundation) only needs this table to exist with RLS enabled;
-- no feature reads/writes it yet. Columns are sized for ticket #5 (upload/parse).
--
-- RLS is the real security boundary (see build brief section 4) — application
-- code must never be the only thing standing between one user's data and
-- another's.

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_filename text not null,
  extracted_text text,
  parsed_data jsonb,
  feedback jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "Users can select their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

create index if not exists resumes_user_id_idx on public.resumes (user_id);
