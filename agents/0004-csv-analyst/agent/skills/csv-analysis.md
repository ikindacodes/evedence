Use when the user asks questions about CSV data, order metrics, aggregations, rankings, or trends that require inspecting or analyzing the dataset.

# CSV analysis workflow

Apply this procedure for every data question about the orders CSV.

## Step 1 — Preview before computing

Call `preview_csv` before writing analysis code on a new question. Use the returned columns, dtypes, row count, and sample rows to confirm names and value shapes.

**Important:** `preview_csv` inspects the file from Node.js on the host. Do **not** use `run_analysis` or Python just to preview or inspect the CSV.

Do not assume column names from memory. The dataset includes: `order_id`, `region`, `product`, `quantity`, `unit_price`, `order_date`.

## Step 2 — Write sandbox Python

Call `run_analysis` with Python that:

1. Reads the CSV from `os.environ["DATA_PATH"]` (set to `data/orders.csv` in the sandbox).
2. Uses the **stdlib only** — `csv`, `collections`, `statistics`, `json`, etc. **Do not import pandas**; the sandbox image has Python but no pip.
3. Prints concise results to **stdout** — tables, key metrics, or labeled lines the user needs.
4. Avoids charts, file writes, network calls, and installing packages.

Example pattern:

```python
import csv
import os
from collections import defaultdict

path = os.environ["DATA_PATH"]
totals = defaultdict(float)

with open(path, newline="") as f:
    for row in csv.DictReader(f):
        value = float(row["quantity"]) * float(row["unit_price"])
        totals[row["region"]] += value

for region, total in sorted(totals.items(), key=lambda item: item[1], reverse=True):
    print(f"{region}: {total:.2f}")
```

Parse numeric columns with `int()` / `float()`. Dates are ISO strings (`YYYY-MM-DD`).

If code fails, read `stderr`, fix the script, and retry once with a simpler approach.

## Step 3 — Answer format

Structure every response as:

### Answer
One or two sentences with the direct conclusion.

### Evidence
Bullets or a compact markdown table with the numbers from sandbox stdout. Only include values the tools returned.

### Method
Plain English describing the computation (grouped by region, computed order value as quantity × unit_price, etc.). Do not paste full code unless the user asks.

## Guardrails

- Never invent statistics not present in tool output.
- Never skip `preview_csv` on the first analysis pass for a question.
- Do not import pandas or third-party packages.
- Do not generate charts or images.
- Do not join multiple files or accept uploads.
- Do not write export files to disk.
- If stdout is empty or the exit code is non-zero, say so and explain the error from stderr.
