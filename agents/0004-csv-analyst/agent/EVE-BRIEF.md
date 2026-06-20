# EVE-BRIEF

## Summary

Answers natural-language questions about a CSV dataset by previewing the file, writing Python analysis code, and executing it in an isolated sandbox.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts` (same auth pattern as sibling agents)

## Core loop

1. User: *"What's the average order value by region?"*
2. Agent: Loads the `csv-analysis` skill → calls `preview_csv` to inspect schema and sample rows → writes Python that reads `DATA_PATH` → calls `run_analysis` to execute in sandbox → formats the result.
3. User sees: A structured response with three sections — **Answer** (1–2 sentence headline), **Evidence** (key numbers as bullets or a small table), **Method** (plain-English summary of what the code computed, not raw code unless asked).

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `preview_csv`, `run_analysis` |
| skills | yes | `csv-analysis` — workflow, safety guardrails, output format |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | no | — |
| schedules | no | — |
| hooks | no | — |
| sandbox | yes | Python execution for `run_analysis` |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `preview_csv.ts` | Inspect the configured CSV without running code | Env: `DATA_PATH` (default `./data/sample-orders.csv`) | `{ path, columns, dtypes, rowCount, sampleRows }` — first ~5 rows | live (local file) | — |
| `run_analysis.ts` | Execute Python analysis code in sandbox | `code` (string) — Python script body; reads CSV from `DATA_PATH` via env injected into sandbox | `{ stdout, stderr, exitCode }` | live (sandbox) | — |
| `agent/sandbox/` | Isolated Python runtime for analysis | — | Executes code submitted by `run_analysis` | live | — |

**Bundled dataset:** `data/sample-orders.csv` — e-commerce orders with columns `order_id`, `region`, `product`, `quantity`, `unit_price`, `order_date`. ~50–100 rows, enough for aggregations, top-N, and date-range questions.

**Sandbox contract:** Python 3 stdlib only (`csv`, `collections`, etc.) — no pip or third-party packages. Code receives `DATA_PATH` as an environment variable. Print results to stdout. No network, no writing files outside sandbox temp.

## Instructions highlights

- Identity: Helpful CSV data analyst focused on accurate, explainable answers
- Must do: Load `csv-analysis` skill before answering; call `preview_csv` before first analysis on a question; call `run_analysis` for any computation beyond what preview shows; respond in **Answer / Evidence / Method** format; cite numbers from tool output only
- Must not: Invent statistics not produced by tools; skip preview on first pass; generate charts or images; join multiple files; accept uploaded files; write export files to disk; run code that accesses the network

## Model & secrets

- **Model:** `openai/gpt-4.1` (with `modelContextWindowTokens` until AI Gateway metadata is available)
- **Secrets:**
  - `AI_GATEWAY_API_KEY` — model inference
  - `DATA_PATH` — optional path to CSV (default `./data/sample-orders.csv`)

## Scope

### In v1

- Single CSV via `DATA_PATH` (bundled sample orders dataset)
- Two tools: `preview_csv` + `run_analysis`
- Python sandbox execution with stdlib `csv` (no pip/pandas)
- Authored skill for workflow, safety, and output format
- HTTP channel + TUI dev workflow
- README with clone-and-run instructions and env setup

### Out of v1

- Charts or matplotlib/image output
- Multiple CSV files or joins
- File upload via channel or tool
- Exporting results to new files on disk
- JSON/Parquet or other formats
- Persistent notebook state across sessions
- Scheduled/batch analysis

## Project location

- **Path:** `agents/0004-csv-analyst/`
- **Package name:** `@ship-eve/0004-csv-analyst`

## Open questions

- none
