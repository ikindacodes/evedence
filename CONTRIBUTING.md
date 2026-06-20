# Contributing

Thanks for your interest in ship-eve.

## What this repo is

A growing collection of runnable eve agents maintained by [@ikindacodes](https://github.com/ikindacodes). Each agent is a real, cloneable project — not a slide deck.

Publishable agent skills (installable via `npx skills add`) live in `skills/`. Local workflow skills in `.cursor/skills/` are gitignored.

## How to contribute

**Issues welcome.** Bug reports, doc improvements, and suggestions for patterns worth demonstrating are appreciated.

**Pull requests:** I'll consider PRs that fix bugs or improve documentation. New agents are authored as part of my own building practice, so please open an issue before submitting a new agent.

## Agent bar

Every agent in `agents/` should:

- Run locally with documented steps
- Do something purposeful (not an empty scaffold)
- Employ real eve authoring surfaces
- Include a README with clone-and-run instructions and `AI_GATEWAY_API_KEY` setup

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```

Use `turbo run typecheck build --affected` to check only changed packages.

## Style

- Always **eve**, never Eve
- Secrets: per-agent `.env.example` with `AI_GATEWAY_API_KEY` only
