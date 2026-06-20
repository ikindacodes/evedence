import { fetchStandupData, standupDaysFromEnv } from "#lib/github-api.js";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Fetch GitHub standup data for the configured user and repository: merged PRs, open PRs, and blocked items.",
  inputSchema: z.object({}),
  auth: {
    getToken: async () => ({ token: process.env.GITHUB_TOKEN! }),
  },
  async execute(_input, ctx) {
    const token = (await ctx.getToken()).token;
    const repoEnv = process.env.GITHUB_REPO;
    const username = process.env.GITHUB_USERNAME;

    if (!repoEnv) {
      throw new Error("GITHUB_REPO is required (format: owner/name)");
    }
    if (!username) {
      throw new Error("GITHUB_USERNAME is required");
    }

    return fetchStandupData({
      token,
      repoEnv,
      username,
      lookbackDays: standupDaysFromEnv(process.env.STANDUP_DAYS),
    });
  },
});
