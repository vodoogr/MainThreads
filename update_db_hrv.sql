-- Añadir columna HRV a la tabla de entradas para el Huawei GT5
ALTER TABLE entradas ADD COLUMN IF NOT EXISTS hrv INTEGER DEFAULT 72;

-- Asegurar que las políticas permiten UPDATE y DELETE
CREATE POLICY "Permitir borrado público de entradas" ON entradas FOR DELETE USING (true);
CREATE POLICY "Permitir actualización pública de entradas" ON entradas FOR UPDATE USING (true);
