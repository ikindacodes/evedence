Use when the user asks for a digest, morning briefing, feed summary, or what's new from the RSS source — including scheduled weekday digest runs.

# Digest workflow

Apply this procedure for every digest request.

## Step 1 — Fetch feed items

Call `fetch_rss_items` before ranking or summarizing. Use only the returned headlines, links, dates, and summaries.

The feed returns at most 30 items. Do not invent stories or URLs.

## Step 2 — Rank into three buckets

From the fetched items, assign each story to exactly one bucket:

| Bucket | Target count | Criteria |
|--------|--------------|----------|
| **Highlights** | ~5 | Most important or interesting for a web/tech practitioner today |
| **Skim** | ~5 | Worth a quick look but lower priority |
| **Skip** | remaining | Low signal, duplicate angles, or noise |

If fewer than 10 items exist, put the best ones in Highlights and Skim and leave Skip empty.

## Step 3 — Output format

Use this markdown shape:

```md
# Tech digest — {feed title or "RSS"}

**Source:** {feed link or DIGEST_SOURCES URL}
**Generated:** {today's date in YYYY-MM-DD}

## Highlights
- **[Title](link)** — one-line why it matters

## Skim
- **[Title](link)** — one-line note

## Skip
- **[Title](link)** — short reason to skip (optional)
```

Keep blurbs to one sentence. Prefer linked titles over bare URLs.

## Scheduled runs

When the prompt asks you to log the digest (scheduled weekday run), call `log_digest` with the exact markdown from Step 3 after composing it.

For interactive HTTP requests, reply in chat with the same markdown and do **not** call `log_digest` unless the user explicitly asks to log it.

## Guardrails

- Never invent headlines, links, or publication dates.
- Never skip `fetch_rss_items` for digest work.
- Do not add Slack, email, or file export steps.
- Do not merge multiple feeds.
