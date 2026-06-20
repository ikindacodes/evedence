import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-4.1",
  // Escape hatch until AI Gateway publishes context-window metadata for this model id.
  modelContextWindowTokens: 1_047_576,
});
