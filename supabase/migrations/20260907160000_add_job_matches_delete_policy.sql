-- job_matches was originally immutable-once-created (no update/delete
-- policy, see 20260907150000_create_job_matches_table.sql's header note).
-- The product now wants a per-entry "clear this from history" action, so
-- add delete for the owning user only — still no update policy, a match
-- stays a record of what was compared and when, just one a user can remove.
--
-- Reversal: `drop policy "Users can delete their own job matches" on
-- public.job_matches;` — safe at any time, no data loss (it only removes
-- the permission to delete, not any rows).

create policy "Users can delete their own job matches"
  on public.job_matches for delete
  using (auth.uid() = user_id);
