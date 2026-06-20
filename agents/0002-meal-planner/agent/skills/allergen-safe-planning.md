Use when planning a meal with dietary restrictions, allergies, ingredient substitutions, or allergen-safe single-meal recommendations.

# Allergen-safe meal planning

Apply this procedure whenever the user mentions allergies, intolerances, vegetarian needs, or ingredients to avoid.

## Step 1 — Gather constraints

Extract from the user message:

- **Servings** (default 4 if unstated)
- **Tagged allergens to exclude:** `dairy`, `gluten`, `nuts` — map plain language ("no cheese" → dairy, "celiac" → gluten, "peanut allergy" → nuts)
- **Ad-hoc exclusions:** anything not in the catalog tags (e.g. shellfish, eggs, soy) — treat as hard constraints even though recipes are not tagged for them
- **Preferences:** cuisine, protein type, "light" vs "hearty", vegetarian

If a constraint is ambiguous, ask one clarifying question before searching.

## Step 2 — Search the catalog

Call `search_recipes` with:

- a `query` reflecting cuisine or dish style
- `excludeAllergens` for any tagged allergens the user must avoid
- `vegetarianOnly: true` when the user wants a vegetarian meal
- `servings` when known

Never recommend a recipe that was not returned by `search_recipes`. If no recipe matches, say so and suggest relaxing one constraint.

## Step 3 — Verify against ad-hoc constraints

For each candidate recipe, scan **ingredients** against ad-hoc exclusions the user named. Reject or flag recipes that contain forbidden ingredients even if allergen tags pass.

Common ad-hoc checks:

| User says | Scan ingredients for |
|-----------|------------------------|
| no shellfish | shrimp, crab, lobster, scallops, mussels, clams, oysters, anchovy |
| no eggs | egg |
| no soy | soy, tofu, tamari, edamame |
| no pork | pork, bacon, ham, prosciutto |

## Step 4 — Format the full recipe

Present exactly one best match using this structure:

```
## [Dish name]

**Servings:** [n] · **Prep time:** [n] min · **Cuisine:** [type]

### Allergen notes
- Tags: [dairy / gluten / nuts / none]
- Vegetarian: [yes / no]
- [Any ad-hoc warnings or confirmations]

### Ingredients
- [scaled list]

### Steps
1. [numbered steps from catalog]

### Substitutions
For each excluded allergen or ad-hoc ingredient present in the original recipe, suggest a specific swap. Examples:
- dairy → coconut cream, nutritional yeast, or omit cheese
- gluten → gluten-free pasta, tamari instead of soy sauce, corn tortillas
- nuts → sunflower seed butter, omit garnish
```

When scaling servings, adjust ingredient quantities proportionally from the recipe's base servings.

## Guardrails

- Do not claim nutrition facts, grocery prices, or delivery availability.
- Do not invent recipes, ingredients, or steps not present in the catalog.
- Keep focus on a **single meal** for one night.
