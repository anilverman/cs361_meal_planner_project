const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Recipes
export const getRecipes = () => fetch(`${API}/recipes`).then(r => r.json());
export const getRecipe = (id) => fetch(`${API}/recipes/${id}`).then(r => r.json());
export const createRecipe = (payload) =>
  fetch(`${API}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(r => r.json());
export const updateRecipe = (id, payload) =>
  fetch(`${API}/recipes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(r => r.json());
export const deleteRecipe = (id) =>
  fetch(`${API}/recipes/${id}`, { method: "DELETE" }).then(r => r.json());

// Planner / Shopping
export const savePlan = (payload) =>
  fetch(`${API}/planner/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(r => r.json());
export const getWeekPlan = (weekStart) =>
  fetch(`${API}/planner/week?weekStart=${weekStart}`).then(r => r.json());
export const getShoppingList = (weekStart) =>
  fetch(`${API}/shopping-list?weekStart=${weekStart}`).then(r => r.json());