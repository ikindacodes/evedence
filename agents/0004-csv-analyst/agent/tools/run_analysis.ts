import {
  readCsvText,
  resolveDataPath,
  SANDBOX_CSV_PATH,
} from "#lib/csv.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Execute Python analysis code against the configured CSV in the sandbox. Code should read DATA_PATH and print results to stdout.",
  inputSchema: z.object({
    code: z
      .string()
      .min(1)
      .describe(
        "Python script body. Use os.environ['DATA_PATH'] with the csv module or stdlib collections.",
      ),
  }),
  async execute({ code }, ctx) {
    const hostPath = resolveDataPath();
    const csvText = readCsvText(hostPath);
    const sandbox = await ctx.getSandbox();

    await sandbox.writeTextFile({ path: SANDBOX_CSV_PATH, content: csvText });

    const script = `import os

os.environ.setdefault("DATA_PATH", "${SANDBOX_CSV_PATH}")

${code}
`;

    await sandbox.writeTextFile({ path: "analysis/run.py", content: script });

    const result = await sandbox.run({
      command: [
        "PYTHON=$(command -v python3 || command -v python)",
        'if [ -z "$PYTHON" ]; then echo "python not found in sandbox" >&2; exit 127; fi',
        "$PYTHON analysis/run.py",
      ].join("\n"),
    });

    return {
      dataPath: hostPath,
      sandboxCsvPath: SANDBOX_CSV_PATH,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
      exitCode: result.exitCode,
    };
  },
});
