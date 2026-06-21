const DEFAULT_DIGEST_SOURCE = "https://hnrss.org/frontpage";
const MAX_ITEMS = 30;

export interface RssItem {
  title: string;
  link: string;
  pubDate: string | null;
  summary: string | null;
}

export interface RssFeed {
  title: string | null;
  link: string | null;
  items: RssItem[];
}

export function digestSourceFromEnv(source = process.env.DIGEST_SOURCES): string {
  const trimmed = source?.trim();
  if (!trimmed) {
    throw new Error("DIGEST_SOURCES is required (RSS feed URL)");
  }

  return trimmed;
}

export function maxItemsFromLimit(limit?: number): number {
  if (limit === undefined) {
    return MAX_ITEMS;
  }

  if (!Number.isFinite(limit) || limit < 1) {
    throw new Error("limit must be a positive number");
  }

  return Math.min(Math.floor(limit), MAX_ITEMS);
}

function readTag(block: string, tag: string): string | null {
  const match = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  if (!match) {
    return null;
  }

  return decodeXml(stripCdata(match[1].trim()));
}

function stripCdata(value: string): string {
  return value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/i, "$1").trim();
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function splitItems(xml: string): string[] {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
}

export async function fetchRssFeed(
  sourceUrl: string,
  limit = MAX_ITEMS,
): Promise<RssFeed> {
  const response = await fetch(sourceUrl, {
    headers: {
      accept: "application/rss+xml, application/xml, text/xml, */*",
      "user-agent": "ship-eve-digest-bot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed (${response.status}) for ${sourceUrl}`);
  }

  const xml = await response.text();
  const items = splitItems(xml)
    .slice(0, limit)
    .map((block) => ({
      title: readTag(block, "title") ?? "(untitled)",
      link: readTag(block, "link") ?? "",
      pubDate: readTag(block, "pubDate"),
      summary: readTag(block, "description") ?? readTag(block, "content:encoded"),
    }))
    .filter((item) => item.link.length > 0);

  return {
    title: readTag(xml, "title"),
    link: readTag(xml, "link"),
    items,
  };
}

export async function fetchDigestFeed(limit?: number): Promise<RssFeed> {
  return fetchRssFeed(digestSourceFromEnv(), maxItemsFromLimit(limit));
}
