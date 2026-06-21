import { fetchDigestFeed, maxItemsFromLimit } from "#lib/rss.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Fetch recent items from the configured RSS feed (DIGEST_SOURCES). Returns up to 30 headlines with links and dates.",
  inputSchema: z.object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(30)
      .optional()
      .describe("Maximum number of feed items to return (default 30)"),
  }),
  async execute({ limit }) {
    const feed = await fetchDigestFeed(maxItemsFromLimit(limit));

    return {
      source: process.env.DIGEST_SOURCES?.trim() ?? null,
      feedTitle: feed.title,
      feedLink: feed.link,
      itemCount: feed.items.length,
      items: feed.items,
    };
  },
});
