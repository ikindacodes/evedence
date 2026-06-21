Use when formatting research material into a Summary / Findings / Sources brief for the user.

# Brief format

Apply when you receive research findings and sources from the orchestrator.

## Summary

- 2–4 sentences answering the user's question directly.
- Lead with a recommendation or clear comparison when the question asks for one.
- No hype; neutral, practical tone.

## Findings

- Return 4–8 strings, each one factual claim supported by the research input.
- One idea per string — the orchestrator will render them as bullets.
- Prefer contrasts (when X…, when Y…) for comparison questions.

## Sources

- Pass through every source from the research input.
- Each entry: `{ name, url? }` — `name` is required; include `url` only when provided.

## Guardrails

- Never invent findings or sources.
- Do not copy long passages — synthesize.
- Do not add sections beyond summary, findings, and sources in the structured output.
