import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

export const SANDBOX_CSV_PATH = "data/orders.csv";

export function resolveDataPath(envPath = process.env.DATA_PATH): string {
  const relative = envPath?.trim() || "./data/sample-orders.csv";
  return isAbsolute(relative) ? relative : resolve(process.cwd(), relative);
}

export function readCsvText(path: string): string {
  return readFileSync(path, "utf8");
}

export function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]!);
  const rows = lines.slice(1).map(parseCsvLine);

  return { headers, rows };
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]!;

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

export function inferColumnTypes(headers: string[], rows: string[][]): Record<string, string> {
  const dtypes: Record<string, string> = {};

  headers.forEach((header, index) => {
    const samples = rows
      .map((row) => row[index]?.trim() ?? "")
      .filter(Boolean)
      .slice(0, 20);

    if (samples.length === 0) {
      dtypes[header] = "unknown";
      return;
    }

    if (samples.every((value) => /^-?\d+$/.test(value))) {
      dtypes[header] = "integer";
      return;
    }

    if (samples.every((value) => /^-?\d+(\.\d+)?$/.test(value))) {
      dtypes[header] = "float";
      return;
    }

    if (samples.every((value) => !Number.isNaN(Date.parse(value)))) {
      dtypes[header] = "date";
      return;
    }

    dtypes[header] = "string";
  });

  return dtypes;
}

export function previewCsvFromPath(path: string, sampleSize = 5) {
  const text = readCsvText(path);
  const { headers, rows } = parseCsv(text);

  return {
    path,
    columns: headers,
    dtypes: inferColumnTypes(headers, rows),
    rowCount: rows.length,
    sampleRows: rows.slice(0, sampleSize).map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
    ),
  };
}

export function rowsToRecords(headers: string[], rows: string[][]) {
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
}
