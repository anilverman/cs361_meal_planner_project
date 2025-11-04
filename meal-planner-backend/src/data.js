// Shared in‑memory data so routes stay in sync. Swap this for a DB later.
export const store = {
  users: [{ id: "u1", email: "demo@example.com" }],
  recipes: [],
  ingredients: {}, // key: recipeId -> [{name, qty, unit}]
};

// key = `${userId}:${weekStart}` -> [{day_index, recipe_id}]
export const plans = new Map();
export const UID = "u1"; // stub auth