-- PASO 1: RENOMBRAR COLUMNA (Si existe como client_id)
DO $$
BEGIN
  IF EXISTS(SELECT column_name FROM information_schema.columns WHERE table_name='posts' AND column_name='client_id') THEN
      ALTER TABLE posts RENAME COLUMN client_id TO user_id;
  END IF;
END $$;

-- PASO 2: CORREGIR TRIGGER DE NOTIFICACIONES
CREATE OR REPLACE FUNCTION notify_post_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Ahora usamos 'user_id' que es el estándar
  IF NEW.user_id IS NOT NULL AND NEW.user_id != auth.uid() THEN
      
      -- Caso A: Nuevo Post Asignado por Admin
      IF TG_OP = 'INSERT' THEN
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (NEW.user_id, 'info', 'Nuevo Post Asignado', 'Tu editor ha creado un nuevo borrador para ti.', '/posts');
      END IF;

      -- Caso B: Cambio de Estado (Feedback o Aprobación)
      IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
         IF NEW.status = 'changes_requested' THEN
            INSERT INTO notifications (user_id, type, title, message, link)
            VALUES (NEW.user_id, 'warning', 'Se requieren cambios', 'Tu editor ha dejado feedback en tu post.', '/posts');
         ELSIF NEW.status = 'scheduled' THEN
            INSERT INTO notifications (user_id, type, title, message, link)
            VALUES (NEW.user_id, 'success', 'Post Aprobado', 'Tu post ha sido programado para publicarse.', '/posts');
         END IF;
      END IF;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-aplicar el trigger
DROP TRIGGER IF EXISTS on_admin_post_action ON posts;
CREATE TRIGGER on_admin_post_action
AFTER INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION notify_post_owner();

-- PASO 3: ARREGLAR PERMISOS RLS (Fix error al guardar)
DROP POLICY IF EXISTS "Clients update own posts" ON posts;

CREATE POLICY "Clients update own posts" ON posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
