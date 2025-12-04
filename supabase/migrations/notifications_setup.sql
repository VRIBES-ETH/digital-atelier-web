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

-- 4. Function: Notify Admin on Review Request
create or replace function public.notify_admin_on_review()
returns trigger as $$
declare
    admin_id uuid;
begin
    -- Find an admin user. For simplicity, we might pick one or broadcast. 
    -- Ideally, you have a 'roles' table or metadata. 
    -- For this MVP, let's assume a specific admin ID or just insert for all admins if we had a way to identify them.
    -- OPTION: We'll fetch the first user with role 'admin' from public.profiles if it exists, or just hardcode for now if we can't find one.
    -- Better approach: The trigger runs with admin privileges.
    
    -- Let's try to find an admin from profiles table
    select id into admin_id from public.profiles where role = 'admin' limit 1;
    
    if admin_id is not null then
        insert into public.notifications (user_id, type, title, message, link)
        values (
            admin_id,
            'action_required',
            'Nueva Solicitud de Revisión',
            'El cliente ha solicitado revisión para un post.',
            '/admin/posts' -- Or specific post link if we had a page for it
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- 5. Trigger: On Post Status Change to 'review_requested' (or 'pending_approval')
-- Checking current codebase, status is likely 'pending_approval'
create trigger on_post_review_request
    after update on public.posts
    for each row
    when (old.status <> 'pending_approval' and new.status = 'pending_approval')
    execute function public.notify_admin_on_review();

-- 6. Function: Notify Client on Admin Action
create or replace function public.notify_client_on_status_change()
returns trigger as $$
begin
    if new.status = 'scheduled' and old.status <> 'scheduled' then
        insert into public.notifications (user_id, type, title, message, link)
        values (
            new.user_id,
            'success',
            'Post Aprobado',
            'Tu post ha sido aprobado y programado.',
            '/dashboard/posts'
        );
    elsif new.status = 'changes_requested' and old.status <> 'changes_requested' then
        insert into public.notifications (user_id, type, title, message, link)
        values (
            new.user_id,
            'warning',
            'Cambios Solicitados',
            'El administrador ha solicitado cambios en tu post.',
            '/dashboard/posts'
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- 7. Trigger: On Post Status Change (Admin Actions)
create trigger on_post_status_change_notify_client
    after update on public.posts
    for each row
    execute function public.notify_client_on_status_change();
