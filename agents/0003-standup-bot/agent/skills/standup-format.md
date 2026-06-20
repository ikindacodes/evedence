Use when the user asks for a standup update, daily sync summary, or what they shipped this week from GitHub.

# Standup format

Apply this procedure after calling `fetch_standup_data`.

## Step 1 — Classify items

Map tool output into three buckets:

| Section | Source field | Include when |
|---------|--------------|--------------|
| **Shipped** | `shipped` | Merged PRs in the lookback window |
| **In progress** | `inProgress` | Open PRs the user is driving (author or assignee) |
| **Blocked** | `blocked` | Blocked issues or PRs waiting on review/checks |

Do not move items between sections. Trust the tool's classification.

## Step 2 — Format the standup

Use this structure:

```
## Shipped
- [PR title](#url) — one-line summary of what landed
(or "None this period.")

## In progress
- [PR title](#url) — current state in plain language
(or "None.")

## Blocked
- [Item title](#url) — why it is blocked (label, review, or failing check)
(or "None.")
```

Guidelines:

- Lead with the highest-signal items (largest impact or longest-running blockers first).
- Keep each bullet to one line plus an optional short clause.
- Include PR/issue numbers when helpful (`#123`).
- When a section is empty, write the explicit none line from the template.

## Step 3 — Close with context

End with one sentence noting the lookback window (from `lookbackDays`) and repository (from `repo`). Do not suggest posting to GitHub or Slack unless the user asks.

## Guardrails

- Do not invent activity not returned by `fetch_standup_data`.
- Do not recommend merging, closing, or commenting on GitHub items.
- Do not expose tokens or raw API payloads.
