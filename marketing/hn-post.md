# HN Show post — Computer Use Cloud

**Status**: draft, not yet posted. Post when: homepage is live on `computeruse.run`, free signup works, and the SDK stub on PyPI returns a clean PreviewError pointing at the waitlist.

---

## Title (pick one)

> **Show HN: Computer Use Cloud – per-active-second cloud browser for AI agents**

Alternates (test if the first underperforms):
- `Show HN: Computeruse.run – one browser cloud for Claude, Browser Use, and Browserbase`
- `Show HN: Computer Use Cloud – 10× cheaper Browserbase alternative for AI agents`

**Title rules to obey:**
- ≤ 80 chars
- "Show HN:" prefix required
- No clickbait or hype words
- One concrete claim (per-active-second / 10× / multi-compat)
- The "Browserbase alternative" variant is the SEO-juiciest but more likely to draw a defensive thread; first option is safer

## URL field

`https://computeruse.run/`

## Body (post as the first comment, ≤ 2,500 chars)

```
Hi HN — I'm <name>, building Computer Use Cloud (computeruse.run).

In one line: pre-configured cloud sandboxes for AI agents, compatible with Anthropic Computer Use, Browser Use SDK, and Browserbase Session API out of the box. Per-active-second billing.

Why we built this:

The current options for running an AI agent in production are all uncomfortable trade-offs.

1) Anthropic Computer Use path. You get the model; you build the browser cluster, screenshot loop, IP rotation, CAPTCHA contract, and ops. Most teams burn an engineer-month on infra they didn't want to build. Reddit thread last month called it "45× more expensive than the math suggests."

2) Browser Use Cloud. Great SDK (we recommend it; we natively support it), but three meters stacked — browser-time + LLM step + per-task surcharge — make the bill unpredictable on long-running agents.

3) Browserbase. Production-polished but per-browser-hour billing, and Computer Use is "wire it yourself" because their abstraction is generic browser automation, not agent-native.

4) Self-host Playwright. Cheap at compute, expensive in ops time. No AI decision layer; no built-in CAPTCHA, residential IP, or live view URL.

Computer Use Cloud picks up all four at once. One SDK (Sandbox.claude() / .openai() / .gemini()), one meter (per active second — idle while the model thinks is free), CAPTCHA + residential IP + live view included on every plan, Apache-2.0 runtime if you'd rather self-host.

A standard agent task (10 min browser + 30 LLM steps + 1 CAPTCHA) costs about $0.10 on Browserbase, $0.15 on Browser Use Cloud, $0.20+ on the self-hosted Anthropic path, and about $0.01 on us. The savings come entirely from per-active-second metering — the model is thinking 60-70% of wall-clock on a typical Computer Use task, and you shouldn't be paying for that.

What I'd love feedback on:

- The /vs/ pages (anthropic-computer-use, browser-use, browserbase). I tried to be honest about where each competitor still wins — would love skeptical reads on whether I got that calibration right.
- The "three compatibility modes" pitch. Does the multi-SDK story land, or does it feel like we're hedging?
- The Apache-2.0 runtime claim. Self-host path will ship at M5; happy to talk about why "OSS sandbox + closed orchestration" is the split.

Free tier is 100 active hours/month, no card. Pro is $20/mo for 500 active hours.

I'm here in the thread.
```

## Replies — pre-written

### If someone says "this looks like a Browserbase clone"

> Fair read at first glance. The two real differences we're betting on: per-active-second billing (which only makes economic sense for AI agent workloads, not for headless test farms) and shipping Computer Use as a first-class primitive instead of a generic browser cloud you wire it onto. If your workload is CDP automation we don't help much; if it's an agent loop where the model is thinking 60-70% of wall-clock, the bill is a different shape.

### If someone says "your pricing is cherry-picked"

> Possibly. The standard task we use (10 min browser, 30 LLM decision steps, 1 CAPTCHA solve, ~35% agent active) is what we see from typical Claude or OpenAI Operator workloads. For other shapes the math changes — pure CDP scraping closes the gap to ~15%; very high storage workloads close it further. Honest comparison + math is at /vs/browserbase.html. If you have a real workload, paste the numbers and I'll do it in the thread.

### If someone says "what if Anthropic/OpenAI just ship hosted Computer Use themselves?"

> Likely within 12-18 months. Our hedge: (a) multi-provider — one SDK across Claude, OpenAI, Gemini, plus Browser Use compat. First-party hosted Computer Use will be single-provider. (b) per-active-second billing matters more as task length grows. (c) Apache-2.0 runtime gives a self-host path no first-party vendor will offer. Worst case: their hosted version is cheap and you only use Claude; we're a stop on the way and you switch back. We're not building this assuming a 10-year moat — we're building it because the next 18 months has a real gap.

### If someone says "why .run instead of .com?"

> The .com is parked by a 2024 squatter and the asking price isn't justified for a launch. .run was the only category-exact-match TLD available. Doubles as a verb signal ("Run Computer Use in the cloud"). We'll revisit .com if it ever opens up at a fair price.

### If someone says "what about the Browser Use folks — won't they hate the comparison?"

> The Browser Use SDK is great and we recommend it. The comparison is specifically against Browser Use Cloud (the hosted product), not the open-source SDK. Their three-meter pricing is the actual pain point we're addressing; we're not arguing their SDK is worse. We ship Browser Use SDK as a first-class mode; they get adoption credit either way.

### If someone says "OSS license question"

> Runtime is Apache 2.0 (M5 milestone). SDK is Apache 2.0 (already shipped at github.com/computeruse-run/sdk). The cloud orchestration / billing layer is closed (standard OSI-friendly OSS-meets-cloud split). Self-hosting the runtime gets you sandbox + agent loop + screenshot capture; you bring your own object storage and your own metering.

## Launch timing

- **Best window for Show HN**: Tuesday or Wednesday, 6:30-7:30am Pacific. Most "Show HN" karma builds in the first 2 hours.
- **Avoid**: Friday afternoons, Sunday nights, US holidays, the day after a major OpenAI/Anthropic launch.
- **Don't post if**: another big AI infra launch is on the front page — gets buried.

## After posting

1. Don't ask friends to upvote. HN flags vote rings and it kills the post.
2. Reply to every substantive comment within 15 minutes for the first hour. Engagement = ranking.
3. If a comment misreads the pitch, correct it once, calmly, with data. Don't argue.
4. Cross-post the link (not a duplicate Show HN) to:
   - `r/LocalLLaMA` — frame around the multi-provider story
   - `r/AI_Agents` — specifically reply to the "45× more expensive" Browserbase thread with the /vs/anthropic-computer-use migration link
   - `r/Anthropic` — frame as "managed Computer Use sandbox"
   - OpenAI Operator + Anthropic Discord channels with a short context line

## 10 specific backlink targets (the first wave)

| URL / channel | Angle |
|---|---|
| `r/AI_Agents` — "Anthropic Computer Use is 45× more expensive" thread | Comment with `/vs/anthropic-computer-use.html` link; offer real math help |
| `r/LocalLLaMA` — Computer Use weekly thread | Frame around multi-provider, self-host option |
| `r/programming` — Show HN cross-post (after HN ranks) | Generic dev-tool framing |
| GitHub Discussions on `browser-use/browser-use` | Announce CDP compat as a contribution, not a competitor |
| GitHub Discussions on `e2b-dev/desktop` | "computeruse.run is a hosted alternative to E2B Desktop for the agent use case" |
| Twitter/X thread tagging `@browserbasehq` and `@theo` (Browser Use) | Lead with the multi-compat angle; not antagonistic |
| Anthropic Discord — `#computer-use` channel | Share the /vs/anthropic-computer-use page; emphasize "you keep your tool schema" |
| LangChain Discord — `#integrations` | Frame as "browser sandbox layer compatible with any LangChain agent" |
| Hacker Newsletter pitch (after week 1, with HN traffic numbers) | Submit via their pitch form once we have data |
| ChangeLog podcast pitch | Once we have a customer story to lead with |
