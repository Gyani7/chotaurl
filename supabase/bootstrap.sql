create extension if not exists pgcrypto;

insert into public.global_settings (id, promo_redirect_percent, anonymous_links_enabled, abuse_threshold, updated_at)
values ('global', 20, true, 80, now())
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  workspace_id uuid := gen_random_uuid();
  workspace_name text := coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1));
begin
  insert into public.users (id, email, name, avatar_url, created_at, updated_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url',
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.users.name),
    avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
    updated_at = now();

  if not exists (select 1 from public.memberships where user_id = new.id) then
    insert into public.workspaces (id, name, slug, created_at, updated_at)
    values (
      workspace_id,
      workspace_name || '''s workspace',
      lower(regexp_replace(workspace_name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(workspace_id::text, 1, 6),
      now(),
      now()
    );
    insert into public.memberships (id, user_id, workspace_id, role, created_at)
    values (gen_random_uuid(), new.id, workspace_id, 'OWNER', now());
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.record_click(
  p_link_id uuid,
  p_destination text,
  p_ip_hash text default null,
  p_country text default null,
  p_city text default null,
  p_browser text default null,
  p_os text default null,
  p_device text default null,
  p_referrer text default null,
  p_user_agent text default null,
  p_is_promo boolean default false,
  p_is_bot boolean default false,
  p_promo_id uuid default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  is_unique_visitor boolean := p_ip_hash is not null and not exists (
    select 1 from public.clicks
    where link_id = p_link_id and ip_hash = p_ip_hash
  );
begin
  insert into public.clicks (
    id, link_id, occurred_at, ip_hash, country, city, browser, os, device, referrer,
    user_agent, destination, is_promo, is_bot
  )
  values (
    gen_random_uuid(), p_link_id, now(), p_ip_hash, p_country, p_city, p_browser, p_os,
    p_device, p_referrer, p_user_agent, p_destination, p_is_promo, p_is_bot
  );

  update public.links
  set
    click_count = click_count + 1,
    unique_click_count = unique_click_count + case when is_unique_visitor then 1 else 0 end,
    updated_at = now()
  where id = p_link_id;

  if p_promo_id is not null then
    update public.promo_urls
    set click_count = click_count + 1, updated_at = now()
    where id = p_promo_id;
  end if;
end;
$$;

alter table public.users enable row level security;
alter table public.workspaces enable row level security;
alter table public.memberships enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.domains enable row level security;
alter table public.api_keys enable row level security;

create or replace function public.is_workspace_member(workspace_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where memberships.workspace_id = is_workspace_member.workspace_id
      and memberships.user_id = auth.uid()
  );
$$;

drop policy if exists "Users can read their profile" on public.users;
create policy "Users can read their profile"
on public.users for select
using (id = auth.uid());

drop policy if exists "Members can read workspaces" on public.workspaces;
create policy "Members can read workspaces"
on public.workspaces for select
using (public.is_workspace_member(id));

drop policy if exists "Members can read memberships" on public.memberships;
create policy "Members can read memberships"
on public.memberships for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "Members can read links" on public.links;
create policy "Members can read links"
on public.links for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "Editors can create links" on public.links;
create policy "Editors can create links"
on public.links for insert
with check (
  exists (
    select 1 from public.memberships
    where memberships.workspace_id = links.workspace_id
      and memberships.user_id = auth.uid()
      and memberships.role in ('OWNER', 'ADMIN', 'EDITOR')
  )
);

drop policy if exists "Editors can update links" on public.links;
create policy "Editors can update links"
on public.links for update
using (
  exists (
    select 1 from public.memberships
    where memberships.workspace_id = links.workspace_id
      and memberships.user_id = auth.uid()
      and memberships.role in ('OWNER', 'ADMIN', 'EDITOR')
  )
);

drop policy if exists "Members can read clicks" on public.clicks;
create policy "Members can read clicks"
on public.clicks for select
using (
  exists (
    select 1
    from public.links
    where links.id = clicks.link_id
      and public.is_workspace_member(links.workspace_id)
  )
);

drop policy if exists "Members can read domains" on public.domains;
create policy "Members can read domains"
on public.domains for select
using (public.is_workspace_member(workspace_id));

drop policy if exists "Members can read API keys" on public.api_keys;
create policy "Members can read API keys"
on public.api_keys for select
using (public.is_workspace_member(workspace_id));
