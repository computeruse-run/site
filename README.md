# cloudbrowser.live

One AI browser session, running continuously, in public. Anyone can watch what the agent is doing and send a short suggestion for the next move. No login, no profile — one collective browser, anonymous, always on.

## Status

**`index.html` is currently a self-contained marketing landing page.** All content in the hero stage (URL morph, agent intent, visitor bubbles, scripted scenarios across four mock pages, counters, marquee) is **mocked client-side** — no backend calls, no network dependencies. The page is a single static file you can host anywhere.

The InsForge backend (schema, edge function, schedule) below is provisioned and live in project `wz4ktvdw.us-east` but **not wired to the page**. It's ready for Phase 2 when the real agent goes live.

## Architecture

```
Browser (index.html) ── @insforge/sdk ──► InsForge ─► realtime: room:public
                                            │
                                            ├─ sessions         (current iframe URL, intent, status)
                                            ├─ messages         (chat + operator events; trigger publishes)
                                            └─ session_moments  (archived highlights)

                              edge function: openagents-bridge
                                            │
                                            └──► browserfabric / OpenAgents  (the actual AI agent)
```

- `index.html` is a single static page. No build step. It subscribes to `room:public` and inserts visitor suggestions directly via `@insforge/sdk`.
- The bridge function does two jobs: `mode: "pull"` (cron) — fetch new operator events from OpenAgents, sanitize, upsert into `messages`. `mode: "forward"` — push a visitor suggestion to OpenAgents so the agent sees it.
- All credentials (the `OPENAGENTS_TOKEN`) live as InsForge secrets. The browser only ever sees the public anon key.

## Setup

```bash
# 1. Link the project (already done if .insforge/project.json exists)
npx @insforge/cli link

# 2. Apply the schema + RLS + realtime triggers
npm run db:apply

# 3. Set the OpenAgents secrets (one-time)
npx @insforge/cli secrets set OPENAGENTS_API https://agents-api.caremojo.app
npx @insforge/cli secrets set OPENAGENTS_NETWORK 0048fff6
npx @insforge/cli secrets set OPENAGENTS_CHANNEL channel-beaa27ab
npx @insforge/cli secrets set OPENAGENTS_TOKEN <workspace-token>

# 4. Deploy the bridge function
npm run fn:deploy

# 5. Schedule the bridge to pull every few seconds
npx @insforge/cli schedules create --slug openagents-bridge --cron "*/5 * * * * *" --body '{"mode":"pull"}'

# 6. Serve the page locally
npm run dev
# open http://localhost:8080
```

## Deploy

The page is one HTML file with no build step — host it anywhere. To use InsForge frontend hosting:

```bash
npx @insforge/cli deployments deploy --dir . --name cloudbrowser-live
```

## Schema

`migrations/20260524235454_init-room.sql` creates:

- `sessions` — one row per continuously-running session, with `browser_live_url`, `current_url`, `current_intent`, `move_count`.
- `messages` — every visible message in the room, with `source` (visitor | operator) and `actor_id` (anonymous visitor or upstream event ID).
- `session_moments` — archived highlights, rendered in the "Recent moments" section for SEO and shareability.
- Realtime channels: `room:public` (every new message), `session:current` (intent + URL updates).
- RLS: anon `SELECT` everything; anon `INSERT` only into `messages` as a visitor in the live session, rate-limited to 6 messages / actor / minute.
