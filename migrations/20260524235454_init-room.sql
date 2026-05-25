-- cloudbrowser.live · initial schema
-- One continuously-running public AI browser session, watched and steered by anonymous visitors.

------------------------------------------------------------------------
-- TABLES
------------------------------------------------------------------------

create table if not exists public.sessions (
  id                 uuid primary key default gen_random_uuid(),
  started_at         timestamptz not null default now(),
  ended_at           timestamptz,
  status             text not null default 'live'
                       check (status in ('live', 'paused', 'ended')),
  browser_live_url   text not null,
  current_url        text,
  current_intent     text,
  move_count         integer not null default 0
);

create unique index if not exists sessions_one_live
  on public.sessions (status) where status = 'live';

create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.sessions(id) on delete cascade,
  source        text not null check (source in ('visitor', 'operator')),
  actor_id      text,
  content       text not null check (length(content) between 1 and 600),
  message_type  text not null default 'chat',
  created_at    timestamptz not null default now()
);

create index if not exists messages_session_created
  on public.messages (session_id, created_at desc);

create index if not exists messages_actor_created
  on public.messages (actor_id, created_at desc)
  where actor_id is not null;

create table if not exists public.session_moments (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  title           text not null,
  body            text,
  url_at_moment   text,
  created_at      timestamptz not null default now()
);

create index if not exists session_moments_session_created
  on public.session_moments (session_id, created_at desc);

------------------------------------------------------------------------
-- TRIGGERS
------------------------------------------------------------------------

-- Every new visible message fans out on the public realtime channel.
create or replace function public.publish_message()
returns trigger
language plpgsql
security definer
as $$
begin
  perform realtime.publish(
    'room:public',
    'message',
    jsonb_build_object(
      'id', new.id,
      'session_id', new.session_id,
      'source', new.source,
      'actor_id', new.actor_id,
      'content', new.content,
      'message_type', new.message_type,
      'created_at', new.created_at
    )
  );
  return new;
end;
$$;

drop trigger if exists messages_publish on public.messages;
create trigger messages_publish
  after insert on public.messages
  for each row
  execute function public.publish_message();

-- An operator message also mirrors into sessions.current_intent and increments move_count,
-- which the hero chrome reads to show "the agent is currently…".
create or replace function public.mirror_operator_intent()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.source = 'operator' then
    update public.sessions
       set current_intent = new.content,
           move_count = move_count + 1
     where id = new.session_id;

    perform realtime.publish(
      'session:current',
      'intent',
      jsonb_build_object(
        'session_id', new.session_id,
        'current_intent', new.content,
        'created_at', new.created_at
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists messages_mirror_intent on public.messages;
create trigger messages_mirror_intent
  after insert on public.messages
  for each row
  execute function public.mirror_operator_intent();

-- Sessions changes (current_url updates from the bridge) also push to session:current.
create or replace function public.publish_session_update()
returns trigger
language plpgsql
security definer
as $$
begin
  if (old.current_url is distinct from new.current_url)
     or (old.status is distinct from new.status)
     or (old.browser_live_url is distinct from new.browser_live_url) then
    perform realtime.publish(
      'session:current',
      'session',
      jsonb_build_object(
        'id', new.id,
        'status', new.status,
        'browser_live_url', new.browser_live_url,
        'current_url', new.current_url,
        'current_intent', new.current_intent,
        'move_count', new.move_count
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists sessions_publish on public.sessions;
create trigger sessions_publish
  after update on public.sessions
  for each row
  execute function public.publish_session_update();

------------------------------------------------------------------------
-- REALTIME CHANNELS
------------------------------------------------------------------------

insert into realtime.channels (pattern, description, enabled)
values
  ('room:public',      'Public message stream for the shared AI browser room', true),
  ('session:current',  'Session state updates (intent, url, status)',          true)
on conflict (pattern) do update set enabled = excluded.enabled;

------------------------------------------------------------------------
-- ROW LEVEL SECURITY
------------------------------------------------------------------------

alter table public.sessions         enable row level security;
alter table public.messages         enable row level security;
alter table public.session_moments  enable row level security;

-- Sessions: anyone can read; only the service role (the bridge function) writes.
drop policy if exists "sessions are public" on public.sessions;
create policy "sessions are public"
  on public.sessions for select
  to anon, authenticated
  using (true);

-- Messages: anyone can read the room.
drop policy if exists "messages are public" on public.messages;
create policy "messages are public"
  on public.messages for select
  to anon, authenticated
  using (true);

-- Messages: anonymous visitors can post — but only as 'visitor', only into the live session,
-- and at most ~6 messages per minute per actor_id (soft rate-limit at the DB layer).
drop policy if exists "visitors may post" on public.messages;
create policy "visitors may post"
  on public.messages for insert
  to anon, authenticated
  with check (
    source = 'visitor'
    and length(content) between 1 and 600
    and actor_id is not null
    and exists (
      select 1 from public.sessions s
      where s.id = session_id and s.status = 'live'
    )
    and (
      select count(*) from public.messages m
      where m.actor_id = messages.actor_id
        and m.created_at > now() - interval '60 seconds'
    ) < 6
  );

-- Session moments: anyone can read; only the bridge writes.
drop policy if exists "moments are public" on public.session_moments;
create policy "moments are public"
  on public.session_moments for select
  to anon, authenticated
  using (true);

------------------------------------------------------------------------
-- BOOTSTRAP THE FIRST LIVE SESSION
-- The bridge function updates current_url / current_intent as the agent moves.
------------------------------------------------------------------------

insert into public.sessions (status, browser_live_url)
select 'live', 'https://www.browserfabric.com/live/RuYRDMmh9wf_S75D-RGPx-Xk91pRv6Uv'
where not exists (
  select 1 from public.sessions where status = 'live'
);
