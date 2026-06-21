import { readFileSync, readdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const SOURCES_DIR = "./data/sources";

export function resolveSourcesDir(dir = process.env.SOURCES_DIR): string {
  const relative = dir?.trim() || SOURCES_DIR;
  return resolve(process.cwd(), relative);
}

export function listBundledSourceFilenames(): string[] {
  const dir = resolveSourcesDir();
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort();
}

export function readBundledSource(filename: string) {
  const safeName = basename(filename.trim());
  if (!safeName.endsWith(".md")) {
    throw new Error("filename must be a markdown file in data/sources/");
  }

  const available = listBundledSourceFilenames();
  if (!available.includes(safeName)) {
    throw new Error(
      `Unknown source "${safeName}". Available: ${available.join(", ") || "(none)"}`,
    );
  }

  const path = join(resolveSourcesDir(), safeName);
  const content = readFileSync(path, "utf8");
  const title = extractTitle(content) ?? safeName.replace(/\.md$/, "");

  return { filename: safeName, title, content };
}

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

export function sourceUrlFromEnv(url = process.env.SOURCE_URL): string | null {
  const trimmed = url?.trim();
  return trimmed || null;
}

export async function fetchSourceUrl(url = sourceUrlFromEnv()) {
  if (!url) {
    return {
      configured: false as const,
      url: null,
      content: null,
      contentType: null,
    };
  }

  const response = await fetch(url, {
    headers: { accept: "text/html, text/plain, application/json, */*" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch SOURCE_URL (${response.status} ${response.statusText})`);
  }

  const contentType = response.headers.get("content-type");
  const content = await response.text();

  return {
    configured: true as const,
    url,
    content,
    contentType,
  };
}
