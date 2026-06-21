Use when the user asks for a comparison, research brief, or summary that requires reading sources and producing Summary / Findings / Sources output.

# Research orchestration

Apply this procedure for every research request.

## Step 1 — Delegate research

Call the `researcher` subagent with:

- The user's full question in `message`
- `outputSchema` matching:

```json
{
  "type": "object",
  "properties": {
    "findings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "url": { "type": "string" }
        },
        "required": ["name"]
      }
    }
  },
  "required": ["findings", "sources"]
}
```

Wait for the structured result before continuing.

## Step 2 — Delegate writing

Call the `writer` subagent with a `message` that includes:

- The original user question
- The full JSON result from `researcher`

Use this `outputSchema`:

```json
{
  "type": "object",
  "properties": {
    "summary": { "type": "string" },
    "findings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "url": { "type": "string" }
        },
        "required": ["name"]
      }
    }
  },
  "required": ["summary", "findings", "sources"]
}
```

## Step 3 — Render for the user

Format the writer output as markdown:

```md
## Summary
{summary}

## Findings
- {finding 1}
- {finding 2}

## Sources
- {name} — {url if present}
```

Keep the writer's wording. Do not add claims beyond the writer output.

## Guardrails

- Always load this skill before delegating.
- Never read bundled sources directly — that is the researcher's job.
- Never skip `researcher` or `writer`.
- Do not use the built-in `agent` tool.
- Do not run subagents in parallel.
