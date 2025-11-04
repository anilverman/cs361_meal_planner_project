const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getRecipes = () => fetch(`${API}/recipes`).then(r => r.json());

export const createRecipe = (payload) =>
  fetch(`${API}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export const generatePlan = (payload) =>
  fetch(`${API}/planner/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export const getWeekPlan = (weekStart) =>
  fetch(`${API}/planner/week?weekStart=${weekStart}`).then(r => r.json());

export const getShoppingList = (weekStart) =>
  fetch(`${API}/shopping-list?weekStart=${weekStart}`).then(r => r.json());