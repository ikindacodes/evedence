import { defaultBackend, defineSandbox } from "eve/sandbox";

const VERIFY_PYTHON = [
  "set -e",
  "PYTHON=$(command -v python3 || command -v python)",
  'if [ -z "$PYTHON" ]; then echo "python not found in sandbox" >&2; exit 127; fi',
  '$PYTHON -c "import csv, json, os, statistics; from collections import Counter, defaultdict; print(1)"',
].join("\n");

export default defineSandbox({
  backend: defaultBackend(),
  revalidationKey: () => "csv-analyst-stdlib-v3",
  async bootstrap({ use }) {
    const sandbox = await use();
    const result = await sandbox.run({ command: VERIFY_PYTHON });

    if (result.exitCode !== 0) {
      throw new Error(
        `Sandbox bootstrap failed: Python stdlib unavailable (exit ${result.exitCode}).\n${result.stderr || result.stdout}`,
      );
    }
  },
  async onSession({ use }) {
    const sandbox = await use();
    try {
      await sandbox.setNetworkPolicy("deny-all");
    } catch {
      // just-bash rejects setNetworkPolicy; local dev may use that backend.
    }
  },
});
