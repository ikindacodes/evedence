import { readBundledSource } from "#lib/sources.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Read a bundled markdown source from data/sources/ by filename (e.g. sqlite-overview.md).",
  inputSchema: z.object({
    filename: z
      .string()
      .min(1)
      .describe("Markdown filename in data/sources/, e.g. postgres-overview.md"),
  }),
  async execute({ filename }) {
    return readBundledSource(filename);
  },
});
