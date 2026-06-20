import { previewCsvFromPath, resolveDataPath } from "#lib/csv.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Preview the configured CSV: column names, inferred types, row count, and sample rows.",
  inputSchema: z.object({}),
  async execute() {
    const path = resolveDataPath();
    return previewCsvFromPath(path);
  },
});
