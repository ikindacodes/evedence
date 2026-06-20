# Skills

Installable [Agent Skills](https://agentskills.io) for building with **eve**. Published here for the [skills CLI](https://skills.sh) — not checked into `.cursor/skills/` (local workflow only).

## Install

```bash
npx skills add ikindacodes/ship-eve --skill create-agent
```

Cursor only:

```bash
npx skills add ikindacodes/ship-eve --skill create-agent --agent cursor -y
```

From a local clone:

```bash
npx skills add . --skill create-agent --agent cursor -y
```

Then invoke `/create-agent` in your agent.

## Available skills

| Skill | Description |
|-------|-------------|
| [create-agent](./create-agent/) | Design interview → EVE-BRIEF → scaffold and implement a runnable eve agent |

## Contributing skills

Add new publishable skills under `skills/<name>/` with a `SKILL.md` (see [create-agent](./create-agent/) for layout). Keep personal or repo-specific workflow skills in `.cursor/skills/` — that directory is gitignored.
