-- Permitir acceso total a los administradores en el bucket client_assets
CREATE POLICY "Admin full access" ON storage.objects
FOR ALL TO authenticated
USING (
  bucket_id = 'client_assets' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'client_assets' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
