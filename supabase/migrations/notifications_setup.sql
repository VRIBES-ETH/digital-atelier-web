-- 1. Create Notifications Table
create table if not exists public.notifications (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type text not null check (type in ('info', 'success', 'warning', 'action_required')),
    title text not null,
    message text not null,
    link text,
    is_read boolean not null default false,
    created_at timestamp with time zone not null default now(),
    constraint notifications_pkey primary key (id)
);

-- 2. Enable RLS
alter table public.notifications enable row level security;

-- 3. RLS Policy: Users can only see their own notifications
create policy "Users can view their own notifications"
    on public.notifications for select
    using (auth.uid() = user_id);

-- Policy for inserting notifications (Service Role or Trigger needs bypass, but for now allow authenticated if needed, though triggers bypass RLS usually)
-- Ideally, we rely on triggers or admin functions. For now, let's allow users to update their own 'is_read' status.
create policy "Users can update their own notifications"
    on public.notifications for update
    using (auth.uid() = user_id);

-- 4. Unified Notification Function
create or replace function public.notify_post_owner()
returns trigger as $$
declare
    admin_id uuid;
    client_name text;
    admin_name text := 'Víctor'; -- Placeholder or fetch from profile if needed
begin
    -- Fetch Admin ID (Assuming single admin or first found)
    select id into admin_id from public.profiles where role = 'admin' limit 1;
    
    -- Fetch Client Name
    select full_name into client_name from public.profiles where id = new.user_id;

    -- SCENARIO 1: Client -> Admin (Request Review)
    if old.status = 'draft' and new.status = 'review_requested' then
        if admin_id is not null then
            insert into public.notifications (user_id, type, title, message, link)
            values (
                admin_id,
                'action_required',
                '⚡ Nueva Revisión',
                'El cliente ' || coalesce(client_name, 'Desconocido') || ' solicita tu feedback.',
                '/admin/content'
            );
        end if;

    -- SCENARIO 2: Admin -> Client (Assign Post)
    elsif old.status = 'draft' and new.status = 'review_client' then
        insert into public.notifications (user_id, type, title, message, link)
        values (
            new.user_id,
            'info',
            '📝 Nuevo Post Asignado',
            admin_name || ' ha redactado un post para ti. Revísalo.',
            '/dashboard/posts'
        );

    -- SCENARIO 3: Admin -> Client (Request Changes / Feedback)
    elsif old.status = 'review_requested' and new.status = 'changes_requested' then
        insert into public.notifications (user_id, type, title, message, link)
        values (
            new.user_id,
            'warning',
            '⚠️ Feedback Recibido',
            admin_name || ' sugiere cambios en tu post.',
            '/dashboard/posts'
        );

    -- SCENARIO 4: Client -> Admin (Request Changes on Admin Post)
    elsif old.status = 'review_client' and new.status = 'changes_requested' then
        if admin_id is not null then
            insert into public.notifications (user_id, type, title, message, link)
            values (
                admin_id,
                'warning',
                '💬 Cliente pide cambios',
                coalesce(client_name, 'El cliente') || ' ha dejado notas en el post propuesto.',
                '/admin/content'
            );
        end if;

    -- SCENARIO 5: Client -> Admin (Approve Admin Post)
    elsif old.status = 'review_client' and new.status = 'scheduled' then
        if admin_id is not null then
            insert into public.notifications (user_id, type, title, message, link)
            values (
                admin_id,
                'success',
                '✅ Post Aprobado',
                coalesce(client_name, 'El cliente') || ' ha aprobado el post. Listo para salir.',
                '/admin/content'
            );
        end if;

    -- SCENARIO 6: Admin -> Client (Approve/Schedule Client Post)
    elsif old.status = 'review_requested' and new.status = 'scheduled' then
        insert into public.notifications (user_id, type, title, message, link)
        values (
            new.user_id,
            'success',
            '🚀 Post Programado',
            'Tu post ha sido validado y programado.',
            '/dashboard/posts'
        );
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger: Unified Post Notification Trigger
drop trigger if exists on_post_status_change_notify on public.posts;
create trigger on_post_status_change_notify
    after update on public.posts
    for each row
    when (old.status is distinct from new.status)
    execute function public.notify_post_owner();

-- Cleanup old triggers if they exist
drop trigger if exists on_post_review_request on public.posts;
drop trigger if exists on_post_status_change_notify_client on public.posts;
drop function if exists public.notify_admin_on_review();
drop function if exists public.notify_client_on_status_change();
