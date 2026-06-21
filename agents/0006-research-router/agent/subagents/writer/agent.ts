import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Formats research findings into a concise user-facing brief with summary, findings, and sources.",
  model: "openai/gpt-4.1-mini",
});
