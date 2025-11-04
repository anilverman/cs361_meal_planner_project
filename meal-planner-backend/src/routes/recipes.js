import { Router } from 'express';
import { db } from '../db.js';
import { dumpToJson } from '../backup.js';
const r = Router();

// GET /recipes – list
r.get('/', async (_req, res) => {
  try {
    const rows = await db.all('SELECT id, title FROM recipes ORDER BY id DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /recipes/:id – detail with ingredients
r.get('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', id);
    if (!recipe) return res.status(404).json({ error: 'not found' });
    const ings = await db.all('SELECT name, qty, unit FROM recipe_ingredients WHERE recipe_id = ? ORDER BY id', id);
    res.json({ ...recipe, ingredients: ings });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /recipes {title, instructions?, ingredients:[{name,qty,unit}]}
r.post('/', async (req, res) => {
  try {
    const { title, instructions, ingredients = [] } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'title required' });

    const result = await db.run('INSERT INTO recipes (title, instructions) VALUES (?, ?)',
      title, instructions || null);
    const recipeId = result.lastID;

    if (ingredients.length) {
      const stmt = await db.prepare('INSERT INTO recipe_ingredients (recipe_id, name, qty, unit) VALUES (?, ?, ?, ?)');
      try {
        for (const i of ingredients) {
          await stmt.run(recipeId, i.name, i.qty, i.unit);
        }
      } finally {
        await stmt.finalize();
      }
    }

    await dumpToJson();
    res.status(201).json({ id: recipeId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default r;