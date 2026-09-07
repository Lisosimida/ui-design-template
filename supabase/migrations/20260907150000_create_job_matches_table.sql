-- job_matches: one row per job-match run, owned by the resume's user.
-- Persists what JobMatchForm previously computed-and-discarded on every
-- submit — a fit score, summary, strengths/gaps/recommendations against one
-- pasted job description — so "Past matches" survives a refresh instead of
-- losing the result the moment the user navigates away.
--
-- Immutable once created (no update policy) — a match is a record of what
-- was compared and when, not something edited in place.

create table if not exists public.job_matches (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  job_description text not null,
  fit_score int not null,
  summary text not null,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.job_matches enable row level security;

create policy "Users can select their own job matches"
  on public.job_matches for select
  using (auth.uid() = user_id);

create policy "Users can insert their own job matches"
  on public.job_matches for insert
  with check (auth.uid() = user_id);

-- No update or delete policy: a match is immutable once created (see the
-- header note above), and there's no delete UI for it — a resume's matches
-- are cleaned up via the resume_id foreign key's cascade delete instead.

create index if not exists job_matches_resume_id_idx on public.job_matches (resume_id);
create index if not exists job_matches_user_id_idx on public.job_matches (user_id);
