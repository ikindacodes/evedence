import { fetchSourceUrl } from "#lib/sources.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

const PREVIEW_CHARS = 12_000;

export default defineTool({
  description:
    "Fetch optional live source content from SOURCE_URL env. Returns configured=false when unset.",
  inputSchema: z.object({}),
  async execute() {
    const result = await fetchSourceUrl();

    if (!result.configured) {
      return {
        configured: false,
        url: null,
        contentPreview: null,
        contentType: null,
        truncated: false,
      };
    }

    const truncated = result.content.length > PREVIEW_CHARS;
    const contentPreview = truncated
      ? result.content.slice(0, PREVIEW_CHARS)
      : result.content;

    return {
      configured: true,
      url: result.url,
      contentPreview,
      contentType: result.contentType,
      truncated,
    };
  },
});
