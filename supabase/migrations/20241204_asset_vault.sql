-- 1. Crear el Bucket (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client_assets', 'client_assets', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Seguridad (RLS) - CRÍTICO
-- Permitir SELECT (Ver archivos) SOLO si es dueño Y tiene plan válido
CREATE POLICY "Clients view own assets (Premium)" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'client_assets' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND plan_tier IN ('seed', 'growth', 'authority') -- Lista de planes permitidos
  )
);

-- Permitir INSERT (Subir archivos) SOLO si es dueño Y tiene plan válido
CREATE POLICY "Clients upload own assets (Premium)" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'client_assets' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND plan_tier IN ('seed', 'growth', 'authority')
  )
);

-- Permitir DELETE (Borrar) con la misma lógica
CREATE POLICY "Clients delete own assets (Premium)" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'client_assets' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND plan_tier IN ('seed', 'growth', 'authority')
  )
);
