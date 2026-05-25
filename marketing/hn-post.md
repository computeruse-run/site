# HN Show post — Computer Use Cloud

**Status**: draft, not yet posted. Post when: homepage is live on `computeruse.run`, free signup works, at least a stub GitHub repo exists at `github.com/computeruse-dev/sdk`.

---

## Title (pick one)

> **Show HN: Computer Use Cloud – per-active-second pricing for Claude/GPT/Gemini agents**

Alts (test if first one underperforms):
- `Show HN: Computer Use Cloud – 60% cheaper Browserbase alternative for agents`
- `Show HN: Computeruse.run – one API for Claude, OpenAI, and Gemini Computer Use`

**Title rules to obey:**
- ≤ 80 chars
- "Show HN:" prefix is required
- No clickbait, no hype words ("revolutionary", "best-in-class")
- One concrete claim (the per-active-second / 60% / one API hook)
- The first alt with `Browserbase alternative` is the SEO-juiciest but more likely to draw a defensive thread; first option is safer

## URL field

`https://computeruse.run/`

## Body (post in the first comment, max 2,500 chars or so)

```
Hi HN — I'm <name>, building Computer Use Cloud (computeruse.run).

The pitch in one line: pre-configured cloud sandboxes for Anthropic Computer Use, OpenAI Operator, and Gemini agents, billed per active second.

What's actually different from Browserbase:

1. Billing. Browserbase charges per browser-hour, so the meter runs while the model is thinking. We charge per active second — idle is free. For a typical Claude Computer Use task that runs 8 minutes wall-clock with ~35% agent-active time, the math is $0.27 on Browserbase vs $0.06 on us. At 1,000 tasks/day that's ~$6,300/mo difference. (For pure CDP scraping where you're active ~100% of the time, the gap shrinks to ~15% — being upfront about this.)

2. One API, three models. Sandbox.claude() / Sandbox.openai() / Sandbox.gemini(). Same Sandbox object, same tools, same screenshot loop. Swap providers per task. Browserbase is generic browser cloud — you wire Computer Use yourself.

3. Faster cold start. ~1.8s vs ~3.2s on Browserbase. Pre-warmed Chromium pool.

4. Runtime is open source (Apache 2.0). Self-host the sandbox when you outgrow the cloud, or use it from day one. No lock-in.

What Browserbase still does better: three years of production polish, Stagehand is the more mature SDK, and they have SOC 2 Type II today (ours is in audit). The detailed honest comparison + a one-page migration guide is at computeruse.run/vs/browserbase.html.

Free tier: 10 active hours/month, no credit card. Pro is $20/mo for 100 active hours, then $0.05/hr.

Happy to answer anything technical — sandbox internals, the per-active-second metering, why per-second matters more than per-hour for agents, where Browserbase is actually winning (we lost that on the docs and on a few edge cases), what's still rough.

(The /vs/browserbase comparison is the one I'd appreciate skeptical reads on — we tried to be honest about where Browserbase wins, not just where we win.)
```

## Replies — pre-written

### If someone says "this looks like a Browserbase clone"

> Fair read at first glance. The two real differences we're betting on: per-active-second billing (which only makes economic sense for AI agent workloads, not for headless test farms) and shipping Computer Use as a first-class primitive instead of a generic browser cloud you wire it onto. If your workload is CDP automation we don't help much; if it's an agent loop where the model is thinking 60-70% of wall-clock, the bill is a different shape.

### If someone says "your pricing comparison is cherry-picked"

> Possibly. The scenario assumed (8 minutes total, 35% active, 1 GB scratch storage) is what we see from typical Claude Computer Use tasks. For other shapes the math changes — pure scraping closes the gap to ~15%; very high storage workloads close it further. The /vs/browserbase page has the full assumptions. If you have a real workload you want priced both ways, paste the numbers and I'll do it in the thread.

### If someone says "what if Anthropic/OpenAI just ship hosted Computer Use themselves?"

> Likely. We assume Anthropic and OpenAI will both have first-party hosted Computer Use within 12-18 months. Our bet: (a) we'll still be cheaper for multi-model teams (one bill for Claude+GPT+Gemini), (b) the Apache-2.0 runtime gives a self-host path no first-party vendor will offer, (c) the per-active-second metering is a non-trivial infra investment we have a head start on. Worst case for us is if all three model vendors ship 60% cheaper than their current per-hour pricing — at which point we have other problems to worry about.

### If someone says "why .run instead of .com?"

> The .com is parked by a 2024 squatter and the asking price isn't justified for a launch. .run is the only category-exact-match TLD available, and it doubles as a verb signal ("Run Computer Use in the cloud"). Plan to revisit .com if we ever have budget.

### If someone says "OSS license question"

> Runtime is Apache 2.0. SDK is MIT. The cloud orchestration / billing layer is closed (typical OSI-friendly OSS-meets-cloud split). Self-hosting the runtime gets you sandbox + agent loop + screenshot capture; you bring your own object storage and your own metering if you want it.

## Launch timing

- **Best window for Show HN**: Tuesday or Wednesday, 6:30-7:30am Pacific. (Most "Show HN" karma builds in the first 2 hours after posting.)
- **Avoid**: Friday afternoons, Sunday nights, US holidays.
- **Don't post if**: another big AI infra launch is on the front page that day — gets buried.

## After posting

1. Don't ask friends to upvote. HN flags vote rings and it kills the post.
2. Reply to every substantive comment within 15 minutes for the first hour. Engagement = ranking.
3. If a comment misreads the pitch, correct it once, calmly, with data. Don't argue.
4. Cross-post the link (not a duplicate "Show HN") to: `r/LocalLLaMA`, `r/AI_Agents` (specifically reply on the "45x more expensive" Browserbase thread), `r/programming` (maybe), and the OpenAI Operator + Anthropic Discord channels with a short context line.

## Adjacent distribution (week of launch)

- The Reddit thread complaining Browserbase is "45x more expensive than DIY" — paste a single comment with the migration guide link. Do not link the homepage as the first comment; lead with helpful content.
- Twitter/X: post a clip of the live view URL + the cost comparison table. Tag `@browserbasehq` only if you're confident in the comparison (they will quote-tweet).
- LinkedIn: skip. Wrong audience for this product.
- Hacker Newsletter / TLDR AI: pitch them in week 2 once HN traffic numbers are visible.
