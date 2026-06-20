# create-agent reference

## EVE-BRIEF template

Write `agent/EVE-BRIEF.md` with this structure. Replace bracketed placeholders; delete optional sections if unused.

```markdown
# EVE-BRIEF

## Summary
[One sentence describing the agent's job]

## Users & channels
- **Who:** [e.g. developer on localhost, Slack team]
- **Channel(s):** [e.g. HTTP via agent/channels/eve.ts]

## Core loop
1. User: [example message]
2. Agent: [tools called, reasoning]
3. User sees: [example response]

## Eve surfaces
| Surface | Used | Notes |
|---------|------|-------|
| tools | yes/no | |
| skills | yes/no | |
| channels | yes/no | |
| connections | yes/no | |
| subagents | yes/no | |
| schedules | yes/no | |
| hooks | yes/no | |
| sandbox | yes/no | |
| evals | yes/no | |

## Tools & connections
| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| get_foo.ts | | | | live | — |

## Instructions highlights
- Identity: [who the agent is]
- Must do: [behaviors]
- Must not: [guardrails]

## Model & secrets
- **Model:** [e.g. openai/gpt-4.1-mini]
- **Secrets:** AI_GATEWAY_API_KEY + [any integration keys]

## Scope
### In v1
- [ ]

### Out of v1
- [ ]

## Project location
- **Path:** [e.g. ./my-agent or packages/support-bot]
- **Package name:** [e.g. my-agent or @acme/support-bot]

## Open questions
- [none, or list anything deferred]
```

---

## Repo layouts

### Standalone (default)

```
my-agent/
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── agent/
    ├── EVE-BRIEF.md
    ├── agent.ts
    ├── instructions.md
    ├── tools/
    └── channels/
```

Scaffold:

```bash
npx eve@latest init my-agent
```

### Existing monorepo

When the repo already contains eve agents (look for directories with `agent/agent.ts`):

1. **Inventory** — list sibling agent packages and read one as a reference (package.json, tsconfig, README).
2. **Mirror** — match scripts, dependency versions, path aliases, and shared config extends.
3. **Place** — create the new agent alongside siblings using the repo's existing folder convention.
4. **Register** — add the package to the workspace manifest if the repo uses one.
5. **Index** — update any agent catalog the repo maintains (README table, docs index).

Do not invent a monorepo layout. Copy what the repo already does.

**Discovery heuristics:**

- Workspace globs in `pnpm-workspace.yaml`, `package.json` workspaces, or `turbo.json`
- Multiple `package.json` files each with `"eve"` in dependencies and an `agent/` subdirectory
- Shared packages like `typescript-config` or `eslint-config` referenced by sibling agents

---

## Docs discovery

Before implementing any eve surface, read the bundled docs:

```
node_modules/eve/docs/
```

**Minimum read list:**

| When implementing | Read |
|-------------------|------|
| Any agent | Introduction, Getting Started |
| Tools | tools surface page |
| Connections | connections surface page |
| Channels | channels surface page |
| Skills, schedules, hooks, sandbox, subagents, evals | matching surface page |

Also scan sibling agents in the repo for established patterns. Do not copy API calls from this skill — they may be stale. If eve is not yet installed, read the published docs at [beta.eve.dev](https://beta.eve.dev) until `node_modules/eve/docs/` is available.

---

## Eve surfaces key

| Surface | Path |
|---------|------|
| tools | `agent/tools/` |
| skills | `agent/skills/` |
| channels | `agent/channels/` |
| connections | `agent/connections/` |
| subagents | `agent/subagents/` |
| schedules | `agent/schedules/` |
| hooks | `agent/hooks/` |
| sandbox | `agent/sandbox/` |
| evals | `evals/` |

Start minimal: `tools` + `channels` is the usual v1. Prefer `connections` when the agent needs real external APIs or MCP servers. Add other surfaces only when the brief requires them.

---

## Question bank

Use as needed during Phase 1 — still one at a time.

**Purpose**
- What is the single most important outcome when someone uses this agent?
- What would make you call v1 "done"?

**Interaction**
- Walk through one real message the user might send. What should happen?
- Should the agent ask clarifying questions before acting?

**Tools & connections**
- What are the named operations (verbs) the model should call?
- For each tool: what fields are required? What does success look like?
- Which external APIs or MCP servers does this agent need? Can we wire a real connection in v1?
- If real data is not feasible yet: what blocks it (missing credentials, rate limits, sandbox policy)? Document the mock fallback in the brief.

**Channels**
- HTTP only, or Slack/Discord/Web Chat?
- Local dev only, or deploy to Vercel?

**Scope**
- What similar feature requests should we explicitly defer?
- What must the agent refuse to do?

**Quality**
- How concise should replies be?
- Any compliance, PII, or safety constraints?
