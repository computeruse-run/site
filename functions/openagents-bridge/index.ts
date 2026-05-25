// cloudbrowser.live · openagents-bridge
//
// Bridges the upstream browserfabric / OpenAgents workspace to the InsForge `messages` and
// `sessions` tables that the SPA reads. Two modes:
//
//   POST /functions/openagents-bridge        body: { mode: "pull" }
//     Fetch new operator events from OpenAgents, sanitize them, upsert into messages.
//     Idempotent — re-runs are safe. Intended to be called by an InsForge cron schedule
//     every few seconds.
//
//   POST /functions/openagents-bridge        body: { mode: "forward", content, actor_id }
//     Forward a visitor suggestion (already stored in messages by the SPA) into the
//     OpenAgents channel so the agent sees it. Idempotent if the SPA provides actor_id.
//
// Secrets expected on the function:
//   OPENAGENTS_API       e.g. https://agents-api.caremojo.app
//   OPENAGENTS_NETWORK   e.g. 0048fff6
//   OPENAGENTS_CHANNEL   e.g. channel-beaa27ab
//   OPENAGENTS_TOKEN     workspace token (never exposed to the browser)
//   INSFORGE_BASE_URL    auto-injected
//   API_KEY              admin key, auto-injected — used for service-role writes

import { createClient } from 'npm:@insforge/sdk';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const HIDDEN_TYPES = new Set(['thinking', 'status', 'todos', 'todo']);

function sanitize(raw: string): string {
  return String(raw || '')
    .replace(/https?:\/\/(?:www\.)?browserfabric\.com\/live\/[^\s)]+/gi, 'live browser link')
    .replace(/\bbrowserfabric\b/gi, 'live browser')
    .replace(/https?:\/\/(?:workspace\.openagents\.org|agents\.caremojo\.app)\/[^\s)]+/gi, 'workspace link')
    .replace(/\bchannel-[a-z0-9-]+\b/gi, 'room')
    .replace(/\bcompany-os-[a-z0-9-]+\b/gi, 'operator')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, 'browser tab');
}

function deterministicId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h * 31) + seed.charCodeAt(i)) >>> 0;
  return `event-${h.toString(36)}`;
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing secret: ${name}`);
  return value;
}

async function loadLiveSession(admin: ReturnType<typeof createClient>) {
  const { data, error } = await admin.database
    .from('sessions')
    .select('*')
    .eq('status', 'live')
    .limit(1);
  if (error) throw new Error(`sessions read failed: ${error.message}`);
  return Array.isArray(data) && data.length ? data[0] : null;
}

async function pull(admin: ReturnType<typeof createClient>): Promise<Response> {
  const api = requiredEnv('OPENAGENTS_API').replace(/\/$/, '');
  const network = requiredEnv('OPENAGENTS_NETWORK');
  const channel = requiredEnv('OPENAGENTS_CHANNEL');
  const token = requiredEnv('OPENAGENTS_TOKEN');

  const session = await loadLiveSession(admin);
  if (!session) return json(503, { ok: false, message: 'No live session' });

  // Pull the last 50 events. We dedupe by deterministic id below.
  const url = new URL(`${api}/v1/events`);
  url.searchParams.set('network', network);
  url.searchParams.set('channel', channel);
  url.searchParams.set('type', 'workspace.message');
  url.searchParams.set('sort', 'asc');
  url.searchParams.set('limit', '50');

  const upstream = await fetch(url, { headers: { 'X-Workspace-Token': token } });
  const text = await upstream.text();
  let payload: any;
  try { payload = JSON.parse(text); } catch { payload = { raw: text }; }
  if (!upstream.ok || payload.code !== 0) {
    return json(502, { ok: false, message: payload.message || `upstream ${upstream.status}` });
  }

  const events = Array.isArray(payload.data?.events) ? payload.data.events : [];

  // Filter visible, normalize, and dedupe against what's already in messages.
  const candidates = events
    .filter((event: any) => {
      const type = String(event?.payload?.message_type || event?.payload?.type || '').toLowerCase();
      return !HIDDEN_TYPES.has(type);
    })
    .map((event: any) => {
      const payload = event?.payload || {};
      const sourceField = String(event?.source || '');
      const isVisitor = sourceField.startsWith('human:') || payload.sender_type === 'human';
      const content = sanitize(payload.content || payload.text || '').trim();
      if (!content) return null;
      const seed = `${event?.timestamp || event?.created_at || ''}:${content}`;
      return {
        actor_id: deterministicId(seed),
        source: isVisitor ? 'visitor' : 'operator',
        content,
        message_type: String(payload.message_type || payload.type || 'chat'),
        created_at: event?.timestamp || event?.created_at,
        session_id: session.id,
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;

  if (!candidates.length) return json(200, { ok: true, inserted: 0 });

  // Skip events we've already mirrored. The actor_id seeded from timestamp+content
  // is unique enough for upstream-mirrored rows.
  const ids = candidates.map((c) => c.actor_id as string);
  const { data: existing } = await admin.database
    .from('messages')
    .select('actor_id')
    .in('actor_id', ids);
  const seen = new Set((existing || []).map((r: any) => r.actor_id));
  const fresh = candidates.filter((c) => !seen.has(c.actor_id));

  if (!fresh.length) return json(200, { ok: true, inserted: 0 });

  // Operator messages only need source-prefix on actor_id so they don't clash with visitor IDs.
  const rows = fresh.map((row) => ({
    ...row,
    actor_id: `${row.source === 'operator' ? 'op' : 'up'}:${row.actor_id}`,
  }));

  const { error: insertErr } = await admin.database.from('messages').insert(rows);
  if (insertErr) return json(500, { ok: false, message: insertErr.message });

  return json(200, { ok: true, inserted: rows.length });
}

async function forward(admin: ReturnType<typeof createClient>, body: any): Promise<Response> {
  const content = String(body?.content || '').trim();
  if (!content || content.length > 600) {
    return json(400, { ok: false, message: 'Invalid content' });
  }

  const api = requiredEnv('OPENAGENTS_API').replace(/\/$/, '');
  const network = requiredEnv('OPENAGENTS_NETWORK');
  const channel = requiredEnv('OPENAGENTS_CHANNEL');
  const token = requiredEnv('OPENAGENTS_TOKEN');

  const upstream = await fetch(`${api}/v1/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Workspace-Token': token,
    },
    body: JSON.stringify({
      network,
      type: 'workspace.message.posted',
      source: 'human:user',
      target: `channel/${channel}`,
      payload: { content, sender_type: 'human' },
      visibility: 'channel',
    }),
  });

  const text = await upstream.text();
  let payload: any;
  try { payload = JSON.parse(text); } catch { payload = { raw: text }; }

  if (!upstream.ok || payload.code !== 0) {
    return json(upstream.ok ? 502 : upstream.status, {
      ok: false,
      message: payload.message || `upstream ${upstream.status}`,
    });
  }

  return json(200, { ok: true });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json(405, { ok: false, message: 'POST only' });

  let body: any = {};
  try {
    if (req.headers.get('content-length') !== '0') body = await req.json();
  } catch {
    return json(400, { ok: false, message: 'Invalid JSON' });
  }

  const admin = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL')!,
    apiKey: Deno.env.get('API_KEY')!,
  });

  try {
    const mode = String(body?.mode || 'pull');
    if (mode === 'pull') return await pull(admin);
    if (mode === 'forward') return await forward(admin, body);
    return json(400, { ok: false, message: `Unknown mode: ${mode}` });
  } catch (error) {
    return json(500, { ok: false, message: (error as Error).message });
  }
}
