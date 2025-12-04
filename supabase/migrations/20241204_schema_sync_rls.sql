-- 1. ACTUALIZAR TABLA POSTS
-- Añadir notas internas (solo visibles para admin) y hash para integridad
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS linkedin_post_id TEXT, -- Para enlazar al post publicado real
ADD COLUMN IF NOT EXISTS linkedin_preview_url TEXT;

-- 2. ACTUALIZAR TABLA PROFILES
-- Añadir campos de gestión de cliente
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'seed' CHECK (plan_tier IN ('seed', 'growth', 'authority', 'validator')),
ADD COLUMN IF NOT EXISTS linkedin_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS linkedin_token_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- 3. CREAR TABLA NOTIFICACIONES (Si no existe)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'action_required')),
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SEGURIDAD (ROW LEVEL SECURITY)
-- Habilitar RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS (Simplificadas para MVP)

-- a) Admin (Tu ID o Rol): Puede ver y editar TODO.
-- (Asumiendo que tienes un rol 'admin' en una tabla de roles o usas tu email específico)
-- CREATE POLICY "Admins can do everything" ON posts FOR ALL USING (auth.email() = 'tu_email@admin.com');

-- b) Clientes: Solo ven SUS propios posts y notificaciones.
-- Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Clients see own posts" ON posts;
DROP POLICY IF EXISTS "Clients update own posts" ON posts;
DROP POLICY IF EXISTS "Clients see own notifications" ON notifications;
DROP POLICY IF EXISTS "Clients update own notifications" ON notifications;

CREATE POLICY "Clients see own posts" ON posts 
FOR SELECT USING (auth.uid() = client_id); -- Note: Using client_id based on schema

CREATE POLICY "Clients update own posts" ON posts 
FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Clients see own notifications" ON notifications 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clients update own notifications" ON notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- 5. ÍNDICES PARA RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_client_id ON posts(client_id);
