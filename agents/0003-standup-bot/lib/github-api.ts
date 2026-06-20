const GITHUB_API = "https://api.github.com";

export type RepoRef = {
  owner: string;
  repo: string;
};

export type StandupItem = {
  number: number;
  title: string;
  url: string;
  state: string;
  reason?: string;
  mergedAt?: string;
  updatedAt?: string;
};

export type StandupData = {
  repo: string;
  username: string;
  lookbackDays: number;
  shipped: StandupItem[];
  inProgress: StandupItem[];
  blocked: StandupItem[];
};

type GitHubUser = {
  login: string;
};

type GitHubLabel = {
  name: string;
};

type GitHubPull = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  merged_at: string | null;
  updated_at: string;
  user: GitHubUser;
  merged_by?: GitHubUser | null;
  assignees: GitHubUser[];
  draft: boolean;
  head: { sha: string };
};

type GitHubIssue = {
  number: number;
  title: string;
  html_url: string;
  state: string;
  updated_at: string;
  user: GitHubUser;
  assignees: GitHubUser[];
  labels: GitHubLabel[];
  pull_request?: unknown;
};

type GitHubReview = {
  state: string;
  user: GitHubUser;
  submitted_at: string;
};

type GitHubCheckRuns = {
  check_runs: Array<{
    name: string;
    status: string;
    conclusion: string | null;
  }>;
};

export function parseRepo(repoEnv: string): RepoRef {
  const [owner, repo, ...rest] = repoEnv.split("/");
  if (!owner || !repo || rest.length > 0) {
    throw new Error(
      'GITHUB_REPO must be in "owner/name" format (e.g. ikindacodes/ship-eve)',
    );
  }
  return { owner, repo };
}

export function standupDaysFromEnv(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "7", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 7;
  }
  return parsed;
}

function githubHeaders(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ship-eve-standup-bot",
  };
}

async function githubFetch<T>(
  token: string,
  path: string,
  searchParams?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${GITHUB_API}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url, { headers: githubHeaders(token) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub API ${response.status} for ${path}: ${body.slice(0, 200)}`,
    );
  }

  return (await response.json()) as T;
}

function isUserInvolved(
  username: string,
  author: GitHubUser,
  assignees: GitHubUser[],
): boolean {
  const target = username.toLowerCase();
  if (author.login.toLowerCase() === target) {
    return true;
  }
  return assignees.some((assignee) => assignee.login.toLowerCase() === target);
}

function hasBlockedLabel(labels: GitHubLabel[]): boolean {
  return labels.some((label) => label.name.toLowerCase() === "blocked");
}

function toItem(
  pull: GitHubPull,
  reason?: string,
): StandupItem {
  return {
    number: pull.number,
    title: pull.title,
    url: pull.html_url,
    state: pull.state,
    reason,
    mergedAt: pull.merged_at ?? undefined,
    updatedAt: pull.updated_at,
  };
}

function toIssueItem(issue: GitHubIssue, reason?: string): StandupItem {
  return {
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    state: issue.state,
    reason,
    updatedAt: issue.updated_at,
  };
}

async function listClosedPulls(
  token: string,
  repoRef: RepoRef,
): Promise<GitHubPull[]> {
  return githubFetch<GitHubPull[]>(
    token,
    `/repos/${repoRef.owner}/${repoRef.repo}/pulls`,
    {
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: "100",
    },
  );
}

async function listOpenPulls(
  token: string,
  repoRef: RepoRef,
): Promise<GitHubPull[]> {
  return githubFetch<GitHubPull[]>(
    token,
    `/repos/${repoRef.owner}/${repoRef.repo}/pulls`,
    {
      state: "open",
      sort: "updated",
      direction: "desc",
      per_page: "100",
    },
  );
}

async function listOpenIssues(
  token: string,
  repoRef: RepoRef,
  username: string,
): Promise<GitHubIssue[]> {
  const issues = await githubFetch<GitHubIssue[]>(
    token,
    `/repos/${repoRef.owner}/${repoRef.repo}/issues`,
    {
      state: "open",
      assignee: username,
      per_page: "100",
    },
  );

  return issues.filter((issue) => !issue.pull_request);
}

async function hasChangesRequested(
  token: string,
  repoRef: RepoRef,
  pullNumber: number,
): Promise<boolean> {
  const reviews = await githubFetch<GitHubReview[]>(
    token,
    `/repos/${repoRef.owner}/${repoRef.repo}/pulls/${pullNumber}/reviews`,
  );

  const latestByUser = new Map<string, GitHubReview>();
  for (const review of reviews) {
    latestByUser.set(review.user.login, review);
  }

  return [...latestByUser.values()].some(
    (review) => review.state === "CHANGES_REQUESTED",
  );
}

async function hasFailingChecks(
  token: string,
  repoRef: RepoRef,
  headSha: string,
): Promise<boolean> {
  const payload = await githubFetch<GitHubCheckRuns>(
    token,
    `/repos/${repoRef.owner}/${repoRef.repo}/commits/${headSha}/check-runs`,
    { filter: "latest" },
  );

  return payload.check_runs.some(
    (run) =>
      run.status === "completed" &&
      (run.conclusion === "failure" || run.conclusion === "timed_out"),
  );
}

async function pullBlockReasons(
  token: string,
  repoRef: RepoRef,
  pull: GitHubPull,
): Promise<string[]> {
  const reasons: string[] = [];

  if (await hasChangesRequested(token, repoRef, pull.number)) {
    reasons.push("changes requested");
  }

  if (await hasFailingChecks(token, repoRef, pull.head.sha)) {
    reasons.push("failing checks");
  }

  return reasons;
}

export async function fetchStandupData(input: {
  token: string;
  repoEnv: string;
  username: string;
  lookbackDays: number;
}): Promise<StandupData> {
  const repoRef = parseRepo(input.repoEnv);
  const repo = `${repoRef.owner}/${repoRef.repo}`;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - input.lookbackDays);

  const [closedPulls, openPulls, openIssues] = await Promise.all([
    listClosedPulls(input.token, repoRef),
    listOpenPulls(input.token, repoRef),
    listOpenIssues(input.token, repoRef, input.username),
  ]);

  const shippedMap = new Map<number, StandupItem>();
  for (const pull of closedPulls) {
    if (!pull.merged_at) {
      continue;
    }

    const mergedAt = new Date(pull.merged_at);
    if (mergedAt < cutoff) {
      continue;
    }

    const authored = pull.user.login.toLowerCase() === input.username.toLowerCase();
    const mergedBy =
      pull.merged_by?.login.toLowerCase() === input.username.toLowerCase();

    if (authored || mergedBy) {
      shippedMap.set(pull.number, toItem(pull));
    }
  }

  const inProgress: StandupItem[] = [];
  const blocked: StandupItem[] = [];

  for (const pull of openPulls) {
    if (pull.draft) {
      continue;
    }

    if (
      !isUserInvolved(input.username, pull.user, pull.assignees)
    ) {
      continue;
    }

    const reasons = await pullBlockReasons(input.token, repoRef, pull);
    if (reasons.length > 0) {
      blocked.push(toItem(pull, reasons.join(", ")));
    } else {
      inProgress.push(toItem(pull));
    }
  }

  for (const issue of openIssues) {
    if (hasBlockedLabel(issue.labels)) {
      blocked.push(toIssueItem(issue, "blocked label"));
    }
  }

  return {
    repo,
    username: input.username,
    lookbackDays: input.lookbackDays,
    shipped: [...shippedMap.values()].sort(
      (a, b) =>
        new Date(b.mergedAt ?? 0).getTime() -
        new Date(a.mergedAt ?? 0).getTime(),
    ),
    inProgress,
    blocked,
  };
}
