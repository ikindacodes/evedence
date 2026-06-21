import { defineSchedule } from "eve/schedules";

const cron = process.env.CRON_EXPRESSION?.trim() || "0 8 * * 1-5";

export default defineSchedule({
  cron,
  markdown: `Generate the weekday tech RSS digest.

1. Load the \`digest-format\` skill.
2. Call \`fetch_rss_items\`.
3. Rank items into Highlights (~5), Skim (~5), and Skip (remaining).
4. Compose the full markdown digest per the skill.
5. Call \`log_digest\` with that markdown so it appears in process stdout.`,
});
