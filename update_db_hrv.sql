-- Legacy helper for the HRV column only.
-- Do not use this file to configure security policies.
-- Use supabase_private_entries.sql for authenticated access rules.

ALTER TABLE public.entradas
ADD COLUMN IF NOT EXISTS hrv INTEGER DEFAULT 72;
