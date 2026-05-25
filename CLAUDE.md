# CLAUDE.md — decision source of truth

> This file is the load-bearing mind map for Computer Use Cloud. Read it before proposing
> anything. Every product, copy, pricing, content, and positioning decision should trace back
> to the trees below.
>
> If a proposed change does not line up with a Tree 1 want, a Tree 2 stack reality, or a
> Tree 3 gap, stop and explain why we are still making the change.
>
> Last updated: 2026-05-25. Update when the underlying market reality changes — not when we
> make tactical product moves.

---

## How to use this file

1. Before generating code, copy, or strategy: re-read the relevant Tree branch.
2. When in doubt about what to build, ask "which gap row in Tree 3 does this close?" If the
   answer is "none," do not build it.
3. When in doubt about who we are building for, ask "which persona in Tree 1 is this for?"
   If the answer is "all of them," it is for none of them.
4. When the user contradicts something here, update this file FIRST, then act on the new
   reality. Don't act on a contradiction without updating the source of truth.

---

# Tree 1 — what users WANT (5 personas)

Each persona is a different buyer with a different decision driver. Conflating them produces
copy that talks to none of them.

```
USER WANTS
│
├── P1. AI startup founder (Series A or pre-seed)
│   │   Building a product where end-users say "do X" and an agent does it.
│   │
│   ├── Outcome: ship a feature that drives the browser on the user's behalf
│   ├── Examples: AI travel agent, AI shopping assistant, AI HR co-pilot
│   ├── Time horizon: weeks to launch, months to scale
│   ├── Budget: $500-$50k/mo (scales with users)
│   ├── Constraints:
│   │   ├── Reliability — single failure = lost customer
│   │   ├── Per-task cost (gross margin)
│   │   ├── Concurrent users
│   │   ├── Live view for end-users to watch
│   │   └── SOC 2 (eventually)
│   └── Decision driver: TIME TO SHIP + UNIT ECONOMICS
│
├── P2. Enterprise RPA / IT automation team
│   │   Replacing manual data entry with AI inside enterprise systems.
│   │
│   ├── Outcome: agent fills 200 claims / expense reports / SAP entries / day
│   ├── Examples: claims processing, healthcare billing, internal ticketing
│   ├── Time horizon: 6-month POCs, multi-year contracts
│   ├── Budget: $5k-$500k/mo (enterprise wallet)
│   ├── Constraints:
│   │   ├── Audit trail / compliance
│   │   ├── Data residency (often on-prem or VPC required)
│   │   ├── Reliability SLA
│   │   ├── Integration with their identity stack (SSO, RBAC)
│   │   └── Change-management approval
│   └── Decision driver: DEPLOYABLE BEHIND OUR FIREWALL + COMPLIANCE
│
├── P3. Data team / growth / scraping
│   │   Pulling structured data off websites at scale.
│   │
│   ├── Outcome: 50k product pages scraped daily into a database
│   ├── Examples: competitor pricing, job listings, real estate, SEO data
│   ├── Time horizon: ongoing pipeline, always-on
│   ├── Budget: $100-$10k/mo
│   ├── Constraints:
│   │   ├── Cost per page (margin-sensitive)
│   │   ├── Anti-bot evasion (residential IPs, captcha)
│   │   ├── Throughput (concurrent pages)
│   │   └── Structured extraction reliability
│   └── Decision driver: COST PER PAGE + ANTI-BLOCK SUCCESS RATE
│
├── P4. Solo dev / indie hacker / hackathon
│   │   Weekend project, learning, demo.
│   │
│   ├── Outcome: demoable agent that does something cool
│   ├── Examples: "book my flight," "tweet my Spotify song," portfolio piece
│   ├── Time horizon: weekend to 30 days
│   ├── Budget: $0-$50/mo (free tier or out-of-pocket)
│   ├── Constraints:
│   │   ├── Free / cheap
│   │   ├── Easy to get running
│   │   ├── Local dev or one-click cloud
│   │   └── Shareable demo link
│   └── Decision driver: FREE + 15-MINUTE QUICKSTART
│
└── P5. QA / SRE engineer
    │   Browser test automation that survives UI changes.
    │
    ├── Outcome: regression suite that doesn't break when devs rename a CSS class
    ├── Examples: e-commerce checkout, login flow tests
    ├── Time horizon: CI/CD integration, runs per-commit
    ├── Budget: $50-$2k/mo per team
    ├── Constraints:
    │   ├── Determinism (same input → same result)
    │   ├── CI integration (GitHub Actions, etc.)
    │   ├── Speed (sub-minute test runs)
    │   └── Diff readability when tests fail
    └── Decision driver: FEWER FALSE POSITIVES THAN PLAIN PLAYWRIGHT
```

---

# Tree 2 — what they ACTUALLY assemble today (4 layers)

Not what they wish existed — what they actually run in production. Four layers, multiple
options per layer. Most teams glue 3–4 of these together themselves.

```
WHAT THEY ACTUALLY BUY / RUN
│
├── Layer A — THE PLANNER (the LLM that decides "click here, type that")
│   │
│   ├── Anthropic Claude Computer Use API
│   │   └── strong vision, rising trend ($5.69 CPC, 1K/mo searches)
│   ├── OpenAI Operator (computer-use-preview API)
│   │   └── increasingly used, official sandbox via ChatGPT
│   ├── Google Gemini agent (Vertex AI)
│   │   └── newer, less proven for browser tasks
│   ├── Browser-use SDK (open-source orchestrator that wraps ANY LLM)
│   │   └── 95k GitHub stars; competes with Stagehand for this slot
│   ├── Stagehand SDK (Browserbase's, wraps any LLM)
│   │   └── 23k stars; built for Browserbase but works elsewhere
│   ├── LangChain / CrewAI agent frameworks
│   │   └── higher-level, less browser-specific
│   └── Custom (raw API + own action loop)
│       └── what every team writes before adopting a framework
│
├── Layer B — THE RUNTIME (the actual browser/desktop process)
│   │
│   ├── Self-host Docker (Anthropic CU reference image)
│   │   └── single-tenant, single-session, painful at scale
│   ├── Browserbase (managed Chromium fleet, per-browser-hour)
│   │   └── the polished option; $39/mo Hobby, $300M valuation
│   ├── Browser-use Cloud (hosted version of the OSS SDK)
│   │   └── 3-meter billing: browser-time + LLM step + per-task
│   ├── E2B Desktop / Sandbox (general code-interpreter + desktop)
│   │   └── 1.4k stars; broader than just browser
│   ├── Skyvern (full-stack: their planner + their runtime)
│   │   └── vision-based, hosted, enterprise-leaning
│   ├── Anchor Browser / Lightpanda / Browserless
│   │   └── adjacent runtimes orbiting the same buyer
│   └── Self-host Playwright on own infra
│       └── cheapest at scale, highest ops cost
│
├── Layer C — THE NETWORK PLUMBING (the stuff agents fail without)
│   │
│   ├── Residential proxy (Bright Data, IPRoyal, Oxylabs)
│   │   └── $200-$2000/mo contracts; required for any real-world site
│   ├── Captcha solver (2Captcha, CapSolver, AntiCaptcha)
│   │   └── $5-$50/mo per workload
│   ├── Authentication / session management
│   │   └── DIY usually; almost no managed product here
│   └── Egress / data-residency controls
│       └── DIY unless you're on AWS/GCP managed paths
│
└── Layer D — THE GLUE (orchestration, observability, error handling)
    │
    ├── Custom retry/error code
    │   └── what 80% of teams have; undocumented, fragile
    ├── LangSmith / LangFuse (LLM observability)
    │   └── popular, model-side, not browser-side
    ├── Helicone / OpenLLMetry
    │   └── same — token-level, not action-level
    ├── Session recording (Browserbase has this; nobody else does cleanly)
    │   └── increasingly demanded for debugging
    └── Replay / time-travel debugging
        └── doesn't really exist yet
```

---

# Tree 3 — the GAP (the product opportunity surface)

This is the actual surface where Tree 1 wants don't line up with Tree 2 realities. Every
column on the roadmap should close at least one row here.

| What user wants | What stack forces them to do | Gap size |
|---|---|---|
| "One bill" | 4 vendors (planner + runtime + proxy + captcha), 4 bills, 4 docs | **HUGE** |
| "One throat to choke when it breaks" | Failure could be any layer; debugging means inspecting each | **HUGE** |
| "Reliable in production" | Glue layer (D) is universally DIY and brittle | LARGE |
| "Run inside our VPC" | Anthropic Docker only, no managed option | LARGE |
| "Watch the agent live" | Only Browserbase has live view; others DIY | MEDIUM |
| "Swap models without rewriting" | Browser-use SDK lets you; Browserbase + Stagehand pin to provider | MEDIUM |
| "Predictable cost per task" | Browser-use Cloud's 3-meter math is unpredictable; Browserbase per-hour is okay; self-host is fixed but ops-heavy | MEDIUM |
| "Replay/debug a failed run" | Browserbase records video; nobody offers structured replay | MEDIUM |
| "Cheap enough for hobby use" | Free tiers exist on most (Browserbase 1hr, Browser-use OSS), but Layer C costs nuke this for any real site | SMALL |
| "Speed (cold start, throughput)" | Browserbase ~3s, others ~5-30s; everyone close enough that it's not a moat | SMALL |

---

# What these trees tell us (the load-bearing conclusions)

Three things that should drive every future decision:

### 1. The two biggest gaps are PACKAGING, not technology.

"One bill" and "one throat to choke" are not solved by writing better code. They are solved
by bundling four layers behind one billing line and one support contract. A team that
packages all four layers credibly wins the "agentic browser capability" PO line over teams
that package three.

### 2. The "resolver" positioning is the strategic answer the market is asking for.

The Semrush data (20% keyword overlap between Browserbase and Browser-use, no agreed
category name, branded volume dwarfing categorical volume) all point to one conclusion:
**the buyer has one budget line and the incumbents are training them to think in
fragments**. Whoever credibly resolves the fragmentation wins.

### 3. Pick ONE persona end-to-end. Don't try to serve all five.

The personas have incompatible decision drivers:
- P1 wants TIME TO SHIP + UNIT ECONOMICS
- P2 wants COMPLIANCE + VPC DEPLOY
- P3 wants COST PER PAGE
- P4 wants FREE + 15-MIN QUICKSTART
- P5 wants FEWER FALSE POSITIVES

A single product surface that serves all five does not exist and we should not pretend to
build it. The next product decision is: WHICH PERSONA DO WE PICK FIRST.

---

# Decisions still open (as of 2026-05-25)

These need to be made before more code or copy ships:

1. **Persona pick.** Which of P1-P5 do we build for first? (My read: P1, because they have
   budget + urgency + the resolver positioning maps cleanly to their pain.)
2. **Positioning.** Stay with "sandbox primitive" (current homepage) or pivot to "resolver"
   framing? (My read: pivot, but only after content moat validates demand.)
3. **First move.** Content moat first, or content + product positioning in parallel?
4. **Persona-driven gap to close first.** Of the LARGE/HUGE gaps in Tree 3, which one is
   our wedge?

---

# Inference caveats (what's NOT verified)

- Tree 1 personas are reasoned from public data + standard tech-buyer patterns. **None of
  this is validated with real interviews.** A handful of 20-minute calls with 3 people in
  different personas would turn this from inference to data.
- Tree 2's "what people actually assemble" is partly inferred from GitHub, Reddit, HN
  threads. Real production assemblies could differ.
- Tree 3 gap sizing is judgment, not measurement.

If we want to commit serious engineering or copy work to a specific persona, we should
validate with interviews first.

---

# Update log

- 2026-05-25 (initial): Created from Semrush research synthesis + persona/stack analysis.
  Five personas, four-layer stack, ten-row gap table. Source for all subsequent decisions.
