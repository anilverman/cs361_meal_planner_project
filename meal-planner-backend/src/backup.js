import fs from 'fs/promises';
import { db } from './db.js';

export async function dumpToJson() {
  const recipes = await db.all('SELECT id, title, instructions FROM recipes ORDER BY id DESC');
  const ingredients = await db.all('SELECT recipe_id, name, qty, unit FROM recipe_ingredients');

  // include meal_slot
  const mealPlan = await db.all(
    'SELECT week_start, day_index, meal_slot, recipe_id FROM meal_plan ORDER BY week_start, day_index, meal_slot'
  );

  const grouped = recipes.map(r => ({
    ...r,
    ingredients: ingredients
      .filter(i => i.recipe_id === r.id)
      .map(({ name, qty, unit }) => ({ name, qty, unit }))
  }));

  const data = { recipes: grouped, meal_plan: mealPlan };
  await fs.writeFile('./data.json', JSON.stringify(data, null, 2), 'utf8');
}