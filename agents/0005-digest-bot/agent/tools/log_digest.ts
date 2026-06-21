import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Write the final formatted digest markdown to stdout. Use when a scheduled digest run should appear in process logs.",
  inputSchema: z.object({
    markdown: z
      .string()
      .min(1)
      .describe("The complete Highlights / Skim / Skip digest in markdown"),
  }),
  execute({ markdown }) {
    console.log(`[digest-bot]\n${markdown.trim()}\n[/digest-bot]`);
    return { logged: true };
  },
});
