# Computer Use Cloud

**Run Computer Use in the cloud — built for Claude, GPT, and Gemini agents.**

Pre-configured cloud sandboxes for Anthropic Computer Use, OpenAI Operator, and Gemini agents. One API across three models. 60% cheaper than Browserbase for typical agent workloads. 2-second cold start. Pay per active second. Free tier — 10 hours/month.

→ Live site (eventually): [computeruse.run](https://computeruse.run/)
→ GitHub org (to register): `github.com/computeruse`

## Status

**This repo currently hosts the marketing site for computeruse.run.** The product itself — SDK, runtime, sandbox orchestration — is not in this repo yet. This repo ships:

| File | What |
|---|---|
| `index.html` | Homepage. Dark dev-tool aesthetic, Tailwind via CDN, no build step. |
| `vs/browserbase.html` | The "vs Browserbase" comparison + migration guide. Targets `browserbase pricing` (140/mo, KD 17) and `browserbase alternative` queries. |
| `marketing/hn-post.md` | Show HN draft for launch day. |
| `migrations/`, `functions/` | **Archived.** Schema + edge function for the previous `cloudbrowser.live` consumer-spectator experiment. Provisioned in InsForge project `wz4ktvdw.us-east` but not wired to the current site. |

## History

The repo was originally `cloudbrowser.live` — a public AI browser session ("watch one AI browse the web, send anonymous nudges"). The pivot to Computer Use Cloud (a B2B developer infra product) happened May 24, 2026 after Semrush keyword analysis showed:

- "agentic browser" / "AI browser" — Wikipedia-owned, low ROI
- "computer use" — 1,900/mo head term, 4,940/mo cluster, exact-match domain available (`computeruse.run`)
- "browserbase pricing" — KD 17, direct comparison wedge

`cloudbrowser.live` stays in the user's name as a brand asset backup. The mock consumer landing lives in git history at commit `9441af1` if anyone wants to fork it.

## Deploy

No build step. Serve as static HTML.

```bash
npx serve . -l 8080
# open http://localhost:8080
```

For production, host on any static CDN (Vercel / Netlify / Cloudflare Pages / S3+CloudFront).

DNS: point `computeruse.run` (already registered) at the static host. Plan to set up `cloudbrowser.live → 301 → computeruse.run` once the new site goes live, so any backlinks pointing at the old domain survive.

## SEO / AEO targets (May 2026 baseline)

| Keyword | Vol/mo | KD | Page |
|---|---|---|---|
| `computer use` | 1,900 | high (DA-bound) | `/` |
| `computer use api` | — | medium | `/` |
| `claude computer use docs` | 140 | 32 | future `/docs/quickstart` |
| `computer use claude` | 110 | 27 | `/` |
| `browserbase pricing` | 140 | 17 | `/vs/browserbase.html` |
| `browserbase alternative` | — | — | `/vs/browserbase.html` |

Schema deployed: `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage` on `/`; `Article` + `FAQPage` on `/vs/browserbase.html`.

## Local dev

```bash
# serve
npx serve . -l 8080

# verify hero fits 100vh across viewports
# verify JSON-LD with https://search.google.com/test/rich-results
# verify the Tailwind CDN loads (no build artifacts to ship)
```

## Roadmap (marketing-side)

- [ ] Wire `computeruse.run` DNS at static host
- [ ] Register `github.com/computeruse` org
- [ ] Publish HN Show post (see `marketing/hn-post.md`)
- [ ] Replace placeholder `/docs/quickstart`, `/openai-operator`, `/gemini-computer-use` routes with real pages
- [ ] Add `sitemap.xml` + `robots.txt`
- [ ] Drop a real OG image at `/og.png` (1200×630)
- [ ] Set up position tracking in Semrush for the keywords above
