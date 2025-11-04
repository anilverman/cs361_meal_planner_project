import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './mealplanner.db',
  driver: sqlite3.Database,
});

await db.exec('PRAGMA foreign_keys = ON');

await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  instructions TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  qty REAL NOT NULL,
  unit TEXT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_start TEXT NOT NULL,      -- ISO date string (Monday)
  day_index INTEGER NOT NULL,    -- 0..6
  meal_slot INTEGER NOT NULL,    -- 0=Breakfast, 1=Lunch, 2=Dinner
  recipe_id INTEGER NOT NULL,
  UNIQUE(week_start, day_index, meal_slot),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
`);