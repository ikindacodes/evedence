import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  url: "https://api.githubcopilot.com/mcp/",
  description:
    "GitHub repository data: pull requests, issues, and search. Use fetch_standup_data for standup summaries.",
  auth: {
    getToken: async () => ({ token: process.env.GITHUB_TOKEN! }),
  },
});
