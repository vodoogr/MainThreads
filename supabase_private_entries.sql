-- Ejecuta este script en Supabase SQL Editor antes de depender del login en produccion.
-- Protege las entradas para que cada usuario solo vea y modifique las suyas.

ALTER TABLE public.entradas
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS entradas_user_id_idx ON public.entradas(user_id);

ALTER TABLE public.entradas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir borrado público de entradas" ON public.entradas;
DROP POLICY IF EXISTS "Permitir actualización pública de entradas" ON public.entradas;
DROP POLICY IF EXISTS "Permitir borrado pÃºblico de entradas" ON public.entradas;
DROP POLICY IF EXISTS "Permitir actualizaciÃ³n pÃºblica de entradas" ON public.entradas;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.entradas;
DROP POLICY IF EXISTS "Users can insert their own entries" ON public.entradas;
DROP POLICY IF EXISTS "Users can update their own entries" ON public.entradas;
DROP POLICY IF EXISTS "Users can delete their own entries" ON public.entradas;

CREATE POLICY "Users can view their own entries"
ON public.entradas
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
ON public.entradas
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
ON public.entradas
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
ON public.entradas
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
