import { defineTool } from "eve/tools";
import { z } from "zod";

const ALLERGENS = ["dairy", "gluten", "nuts"] as const;

type Allergen = (typeof ALLERGENS)[number];

type Recipe = {
  id: string;
  name: string;
  cuisine: string;
  prepMinutes: number;
  baseServings: number;
  vegetarian: boolean;
  allergens: Allergen[];
  ingredients: string[];
  steps: string[];
  tags: string[];
};

const RECIPES: Recipe[] = [
  {
    id: "lemon-herb-chicken",
    name: "Lemon Herb Roast Chicken",
    cuisine: "American",
    prepMinutes: 55,
    baseServings: 4,
    vegetarian: false,
    allergens: [],
    ingredients: [
      "4 bone-in chicken thighs",
      "2 tbsp olive oil",
      "1 lemon, sliced",
      "3 cloves garlic, minced",
      "1 tsp dried oregano",
      "Salt and pepper",
    ],
    steps: [
      "Heat oven to 425°F.",
      "Rub chicken with oil, garlic, oregano, salt, and pepper.",
      "Nestle lemon slices around chicken in a baking dish.",
      "Roast 40–45 minutes until juices run clear.",
    ],
    tags: ["dinner", "poultry", "roast"],
  },
  {
    id: "creamy-mushroom-pasta",
    name: "Creamy Mushroom Pasta",
    cuisine: "Italian",
    prepMinutes: 30,
    baseServings: 4,
    vegetarian: true,
    allergens: ["dairy", "gluten"],
    ingredients: [
      "12 oz fettuccine",
      "8 oz cremini mushrooms, sliced",
      "1 cup heavy cream",
      "3 tbsp butter",
      "2 cloves garlic, minced",
      "1/2 cup parmesan, grated",
      "Salt and pepper",
    ],
    steps: [
      "Cook pasta until al dente; reserve 1 cup pasta water.",
      "Sauté mushrooms in butter until browned.",
      "Add garlic, then cream; simmer 3 minutes.",
      "Toss pasta with sauce and parmesan, thinning with pasta water as needed.",
    ],
    tags: ["dinner", "pasta", "comfort"],
  },
  {
    id: "thai-coconut-curry",
    name: "Thai Coconut Vegetable Curry",
    cuisine: "Thai",
    prepMinutes: 35,
    baseServings: 4,
    vegetarian: true,
    allergens: [],
    ingredients: [
      "1 can coconut milk",
      "2 tbsp red curry paste",
      "1 bell pepper, sliced",
      "1 cup snap peas",
      "1 carrot, sliced",
      "1 tbsp fish sauce or soy sauce",
      "Fresh basil",
      "Jasmine rice for serving",
    ],
    steps: [
      "Simmer curry paste in half the coconut milk for 2 minutes.",
      "Add remaining coconut milk and vegetables; cook 12 minutes.",
      "Season with fish sauce or soy sauce.",
      "Serve over rice with basil.",
    ],
    tags: ["dinner", "curry", "coconut"],
  },
  {
    id: "caprese-salad",
    name: "Caprese Salad with Balsamic",
    cuisine: "Italian",
    prepMinutes: 15,
    baseServings: 4,
    vegetarian: true,
    allergens: ["dairy"],
    ingredients: [
      "3 large tomatoes, sliced",
      "8 oz fresh mozzarella, sliced",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "1 tbsp balsamic glaze",
      "Flaky salt",
    ],
    steps: [
      "Alternate tomato and mozzarella slices on a platter.",
      "Tuck basil between layers.",
      "Drizzle with olive oil and balsamic glaze.",
      "Finish with flaky salt.",
    ],
    tags: ["light", "salad", "summer"],
  },
  {
    id: "peanut-noodle-stir-fry",
    name: "Peanut Noodle Stir Fry",
    cuisine: "Asian fusion",
    prepMinutes: 25,
    baseServings: 4,
    vegetarian: true,
    allergens: ["nuts", "gluten"],
    ingredients: [
      "8 oz spaghetti or udon",
      "1/3 cup peanut butter",
      "2 tbsp soy sauce",
      "1 tbsp rice vinegar",
      "1 bell pepper, julienned",
      "2 cups shredded cabbage",
      "2 green onions, sliced",
      "Crushed peanuts for garnish",
    ],
    steps: [
      "Cook noodles; drain and set aside.",
      "Whisk peanut butter, soy sauce, vinegar, and 3 tbsp warm water.",
      "Stir-fry pepper and cabbage 4 minutes.",
      "Toss noodles, vegetables, and sauce; garnish with peanuts.",
    ],
    tags: ["dinner", "noodles", "quick"],
  },
  {
    id: "grilled-salmon-quinoa",
    name: "Grilled Salmon with Herbed Quinoa",
    cuisine: "Mediterranean",
    prepMinutes: 30,
    baseServings: 4,
    vegetarian: false,
    allergens: [],
    ingredients: [
      "4 salmon fillets",
      "1 cup quinoa",
      "2 cups vegetable broth",
      "1 tbsp olive oil",
      "1 lemon, juiced",
      "2 tbsp chopped parsley",
      "Salt and pepper",
    ],
    steps: [
      "Cook quinoa in broth until fluffy; fold in parsley and lemon juice.",
      "Season salmon with salt and pepper; brush with olive oil.",
      "Grill or pan-sear salmon 4 minutes per side.",
      "Serve salmon over quinoa.",
    ],
    tags: ["dinner", "fish", "healthy"],
  },
  {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    cuisine: "Italian",
    prepMinutes: 40,
    baseServings: 4,
    vegetarian: true,
    allergens: ["dairy", "gluten"],
    ingredients: [
      "1 lb pizza dough",
      "1/2 cup tomato sauce",
      "8 oz fresh mozzarella",
      "Fresh basil",
      "2 tbsp olive oil",
    ],
    steps: [
      "Heat oven to 475°F with a pizza stone or baking sheet inside.",
      "Stretch dough; spread sauce and tear mozzarella over top.",
      "Bake 10–12 minutes until crust is golden.",
      "Top with basil and olive oil.",
    ],
    tags: ["dinner", "pizza", "classic"],
  },
  {
    id: "black-bean-tacos",
    name: "Black Bean Tacos with Lime Slaw",
    cuisine: "Mexican",
    prepMinutes: 25,
    baseServings: 4,
    vegetarian: true,
    allergens: ["gluten"],
    ingredients: [
      "2 cans black beans, drained",
      "1 tsp cumin",
      "8 small flour tortillas",
      "2 cups shredded cabbage",
      "1 lime, juiced",
      "1/4 cup cilantro",
      "Hot sauce to taste",
    ],
    steps: [
      "Warm beans with cumin and a splash of water.",
      "Toss cabbage with lime juice and cilantro.",
      "Warm tortillas; fill with beans and slaw.",
      "Serve with hot sauce.",
    ],
    tags: ["dinner", "tacos", "quick"],
  },
  {
    id: "caesar-salad",
    name: "Classic Caesar Salad",
    cuisine: "American",
    prepMinutes: 20,
    baseServings: 4,
    vegetarian: false,
    allergens: ["dairy", "gluten"],
    ingredients: [
      "2 romaine hearts, chopped",
      "1/2 cup caesar dressing",
      "1/2 cup parmesan, shaved",
      "1 cup croutons",
      "1 anchovy fillet, minced (optional)",
      "Black pepper",
    ],
    steps: [
      "Toss romaine with dressing until coated.",
      "Fold in parmesan and croutons.",
      "Finish with anchovy and black pepper if using.",
    ],
    tags: ["light", "salad", "classic"],
  },
  {
    id: "tofu-vegetable-stir-fry",
    name: "Tofu and Vegetable Stir Fry",
    cuisine: "Chinese",
    prepMinutes: 30,
    baseServings: 4,
    vegetarian: true,
    allergens: [],
    ingredients: [
      "14 oz firm tofu, cubed",
      "2 cups broccoli florets",
      "1 red bell pepper, sliced",
      "2 tbsp tamari (gluten-free soy sauce)",
      "1 tbsp sesame oil",
      "1 tbsp grated ginger",
      "2 cloves garlic, minced",
      "Cooked rice for serving",
    ],
    steps: [
      "Pan-fry tofu in sesame oil until golden; set aside.",
      "Stir-fry broccoli and pepper 5 minutes.",
      "Add ginger, garlic, tamari, and tofu; toss 2 minutes.",
      "Serve over rice.",
    ],
    tags: ["dinner", "stir-fry", "vegan-friendly"],
  },
];

function matchesQuery(recipe: Recipe, query: string): boolean {
  const haystack = [
    recipe.name,
    recipe.cuisine,
    ...recipe.tags,
    ...recipe.ingredients,
  ]
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function excludesAllergens(recipe: Recipe, excludeAllergens: string[]): boolean {
  const excluded = new Set(excludeAllergens.map((a) => a.toLowerCase()));
  return !recipe.allergens.some((allergen) => excluded.has(allergen));
}

export default defineTool({
  description:
    "Search the recipe catalog by query and optional dietary filters.",
  inputSchema: z.object({
    query: z.string().min(1).describe("Keywords such as cuisine, dish type, or main ingredient"),
    excludeAllergens: z
      .array(z.enum(ALLERGENS))
      .optional()
      .describe("Allergens to exclude: dairy, gluten, nuts"),
    vegetarianOnly: z
      .boolean()
      .optional()
      .describe("When true, return only vegetarian recipes"),
    servings: z
      .number()
      .int()
      .min(1)
      .optional()
      .describe("Target servings; results include scaling note when different from base"),
  }),
  async execute({ query, excludeAllergens = [], vegetarianOnly, servings }) {
    let results = RECIPES.filter((recipe) => matchesQuery(recipe, query));

    if (excludeAllergens.length > 0) {
      results = results.filter((recipe) =>
        excludesAllergens(recipe, excludeAllergens),
      );
    }

    if (vegetarianOnly) {
      results = results.filter((recipe) => recipe.vegetarian);
    }

    return {
      query,
      excludeAllergens,
      vegetarianOnly: vegetarianOnly ?? false,
      servings,
      count: results.length,
      recipes: results.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        cuisine: recipe.cuisine,
        prepMinutes: recipe.prepMinutes,
        baseServings: recipe.baseServings,
        vegetarian: recipe.vegetarian,
        allergens: recipe.allergens,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        tags: recipe.tags,
        scalingNote:
          servings && servings !== recipe.baseServings
            ? `Scale ingredient quantities from ${recipe.baseServings} to ${servings} servings.`
            : undefined,
      })),
    };
  },
});
