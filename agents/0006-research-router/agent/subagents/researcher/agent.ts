import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Reads bundled markdown sources and optional live URL; extracts factual findings with citations.",
  model: "openai/gpt-4.1-mini",
});
