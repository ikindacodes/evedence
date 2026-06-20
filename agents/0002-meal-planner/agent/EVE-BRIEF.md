# EVE-BRIEF

## Summary

Plans a single meal from a mock recipe catalog, respecting tagged allergens and ad-hoc dietary constraints via an authored skill.

## Users & channels

- **Who:** Developer on localhost (TUI or HTTP client)
- **Channel(s):** HTTP via `agent/channels/eve.ts` (same auth pattern as `0001-weather`)

## Core loop

1. User: *"I need a dairy-free dinner for 4 — nothing with nuts either."*
2. Agent: Loads the allergen-planning skill → calls `search_recipes` with query/constraints → picks a matching recipe → formats a full recipe with substitution notes for any flagged allergens.
3. User sees: Dish name, servings, prep time, ingredient list, numbered steps, allergen warnings, and substitution suggestions for excluded ingredients.

## Eve surfaces

| Surface | Used | Notes |
|---------|------|-------|
| tools | yes | `search_recipes` — mock in-memory catalog |
| skills | yes | `allergen-safe-planning` — constraint checks, output format, substitutions |
| channels | yes | HTTP eve channel |
| connections | no | — |
| subagents | no | — |
| schedules | no | — |
| hooks | no | — |
| sandbox | no | — |
| evals | no | — |

## Tools & connections

| File | Purpose | Inputs | Returns | Data source | Fallback reason (if mock) |
|------|---------|--------|---------|-------------|---------------------------|
| `search_recipes.ts` | Find recipes matching a text query and optional dietary filters | `query` (string), `excludeAllergens` (optional string array), `servings` (optional number) | Array of matching recipes with name, cuisine, prepMinutes, servings, ingredients, steps, tags (allergens, vegetarian) | mock | No external recipe API; keeps agent clone-and-run with zero extra secrets |

Mock catalog: ~8–10 recipes tagged with **dairy**, **gluten**, **nuts**, and **vegetarian**. Skill handles ad-hoc constraints not in tags (e.g. "no shellfish") via instructions and reasoning.

## Instructions highlights

- Identity: Helpful meal-planning assistant focused on single-meal recommendations
- Must do: Load allergen skill before planning; call `search_recipes` before recommending; output full recipe format per skill; suggest substitutions when excluding allergens
- Must not: Invent recipes outside the catalog; claim live nutrition or grocery data; plan multi-day menus as a primary flow

## Model & secrets

- **Model:** `openai/gpt-4.1-mini`
- **Secrets:** `AI_GATEWAY_API_KEY` only

## Scope

### In v1

- Single-meal planning for one night
- Mock `search_recipes` with tagged allergens (dairy, gluten, nuts, vegetarian)
- Authored skill for allergen checks, ad-hoc constraints, full-recipe output, and substitutions
- HTTP channel + TUI dev workflow
- README with clone-and-run instructions

### Out of v1

- Multi-day / weekly meal plans as first-class flow
- Grocery, nutrition, or delivery APIs
- User accounts or persistent preferences
- Real recipe database or web search

## Project location

- **Path:** `agents/0002-meal-planner/`
- **Package name:** `@ship-eve/0002-meal-planner`

## Open questions

- none
