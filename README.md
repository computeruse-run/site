# Computer Use Cloud

**Run Computer Use in the cloud — one browser cloud for every AI agent stack.**

Drop-in compatible with Anthropic Computer Use, Browser Use SDK, and Browserbase Session API. Per-active-second billing, ~10× cheaper for typical agent tasks. Free tier — 100 hours/month.

→ Live site (eventually): [computeruse.run](https://computeruse.run/)
→ GitHub org: [`github.com/computeruse-dev`](https://github.com/computeruse-dev)
→ SDK + spec: [`github.com/computeruse-dev/sdk`](https://github.com/computeruse-dev/sdk)

## Status

**This repo currently hosts the marketing site for computeruse.run.** The SDK + runtime + engineering spec live in their own repo at `github.com/computeruse-dev/sdk`. This repo ships:

| File | What |
|---|---|
| `index.html` | Homepage. Use-case-first IA (5 cards: agent product backend, RPA, scraping, QA, individual dev), 3 compatibility modes (Claude CU / Browser Use+CDP / Browserbase Session API), 10-row comparison table across 5 competitors, 3-tier pricing, 8-Q FAQ. Dark Vercel/Cursor aesthetic. |
| `vs/anthropic-computer-use.html` | Comparison + migration guide vs the self-hosted Anthropic Computer Use path. "Brain vs body" framing. |
| `vs/browser-use.html` | Comparison vs Browser Use Cloud's 3-meter pricing. SDK stays, meters collapse. |
| `vs/browserbase.html` | Comparison + 30-min migration guide vs Browserbase. Per-active-second math spelled out. |
| `marketing/hn-post.md` | Show HN draft + 6 pre-written replies + launch timing + 10 backlink targets. |
| `migrations/`, `functions/`, `sdk/` | **Archived.** Schema + edge function from the prior `cloudbrowser.live` experiment, plus the now-mirrored SDK stub. Not active. |

## History

Three pivots happened in this repo:

1. **`cloudbrowser.live` consumer demo** (May 22-24) — public AI browser session, watch one AI browse with anonymous nudges. Reference commit `9441af1`.
2. **First `computeruse.run` rebuild** (May 24) — generic developer-tool framing comparing only to Browserbase. Reference commit `d2061cb`.
3. **Use-case-first IA** (May 25, current) — 5 user-archetype cards, 3 compatibility modes (added Browser Use + plain Playwright/CDP), 5-way comparison table, $0.01 vs $0.10 standard task baseline.

The pivots were driven by Semrush keyword data showing "computer use" is the highest-volume head term in the category (1,900/mo, 4,940/mo cluster), and that use-case-first information architecture wins comparison/AEO traffic better than feature-first.

`cloudbrowser.live` stays in the user's name as a brand backup. To revive the consumer demo, check out commit `9441af1`.

## Deploy

No build step. Static HTML, Tailwind via CDN.

```bash
npx serve . -l 8080
# open http://localhost:8080
```

For production, host on any static CDN (Vercel / Netlify / Cloudflare Pages / S3+CloudFront).

DNS: point `computeruse.run` (already registered) at the static host. Plan to set up `cloudbrowser.live → 301 → computeruse.run` once the new site goes live, so any backlinks pointing at the old domain survive.

## SEO / AEO targets (May 25, 2026 baseline)

| Keyword | Volume / KD | Page |
|---|---|---|
| `computer use` | 1,900 / high | `/` |
| `computer use api` | — / medium | `/` |
| `claude computer use docs` | 140 / 32 | future `/docs/quickstart` |
| `computer use claude` | 110 / 27 | `/` |
| `browser use cloud alternative` | — / low | `/vs/browser-use.html` |
| `browser use pricing` | — / low | `/vs/browser-use.html` |
| `browserbase pricing` | 140 / 17 | `/vs/browserbase.html` |
| `browserbase alternative` | — / medium | `/vs/browserbase.html` |
| `anthropic computer use self host` | — / low | `/vs/anthropic-computer-use.html` |
| `what is computer use` | 90 / 35 | `/` (FAQ + JSON-LD) |
| `what is the best ai app for iphone` | 260 / 21 | future article (not yet built) |

Schema deployed:
- `/` — `Organization`, `WebSite`, `SoftwareApplication` with 3 Offers, `FAQPage` (8 Qs)
- `/vs/*.html` — `Article` + `FAQPage` (5-7 Qs each)

## Standard agent task baseline

Every "cost per task" claim across the site references the same scenario, so the comparisons are apples-to-apples:

> **10 minutes browser uptime · 30 LLM decision steps · 1 CAPTCHA solve · ~35% agent active**

Roll-up:
- Self-built Playwright: **~$0.05** (excl. ops)
- Anthropic reference path: **~$0.20** (compute + ops)
- Browser Use Cloud: **~$0.15** (3 meters)
- Browserbase: **~$0.10**
- Computer Use Cloud: **~$0.01**

## Pricing tiers (consistent across site, SDK README, and SPEC)

| Plan | Price | Active hrs | Concurrency | Use case |
|---|---|---|---|---|
| Free | $0/mo | 100 | 5 | Individual dev, hackathon |
| Pro | $20/mo | 500 (+$0.01/extra hr) | 25 | RPA, scraping, QA |
| Team | $200/mo | 5,000 | unlimited (fair use) | Product backend |

## Roadmap (marketing-side)

- [x] Register `github.com/computeruse-dev` org
- [x] Push SDK stub to `github.com/computeruse-dev/sdk`
- [x] Engineering spec inside SDK repo (`SPEC.md`)
- [ ] Publish `computeruse` to PyPI (run `twine upload` per `~/git/sdk/PUBLISHING.md`)
- [ ] Wire `computeruse.run` DNS at static host
- [ ] Drop a real OG image at `/og.png` (1200×630)
- [ ] Add `sitemap.xml` + `robots.txt`
- [ ] Publish HN Show post (see `marketing/hn-post.md`)
- [ ] Set up `cloudbrowser.live → 301 → computeruse.run` redirect
- [ ] Create stub `github.com/computeruse-dev/runtime` repo (referenced in homepage footer)
- [ ] Set up Semrush position tracking for the keywords above
- [ ] Resolve the 5 marketing-vs-spec inconsistencies in `~/git/sdk/SPEC.md` Appendix A

## See also

- Engineering spec: [`~/git/sdk/SPEC.md`](https://github.com/computeruse-dev/sdk/blob/main/SPEC.md) — the contract for everything claimed on this site
- SDK publish flow: [`~/git/sdk/PUBLISHING.md`](https://github.com/computeruse-dev/sdk/blob/main/PUBLISHING.md)
