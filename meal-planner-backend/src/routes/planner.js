import { Router } from 'express';
import { db } from '../db.js';
import { dumpToJson } from '../backup.js';
const r = Router();

// POST /planner/generate {weekStart, recipeIds:[7 ids]}
r.post('/generate', async (req, res) => {
  try {
    const { weekStart, recipeIds = [] } = req.body;
    if (!weekStart) return res.status(400).json({ error: 'weekStart required' });
    if (recipeIds.length < 7) return res.status(400).json({ error: 'need 7 recipeIds' });

    // Upsert 7 days
    await db.exec('BEGIN');
    try {
      for (let day = 0; day < 7; day++) {
        const recipeId = recipeIds[day];
        const exists = await db.get('SELECT id FROM recipes WHERE id = ?', recipeId);
        if (!exists) throw new Error(`recipe ${recipeId} not found`);
        await db.run(
          `INSERT INTO meal_plan (week_start, day_index, recipe_id)
           VALUES (?, ?, ?)
           ON CONFLICT(week_start, day_index) DO UPDATE SET recipe_id=excluded.recipe_id`,
          weekStart, day, recipeId
        );
      }
      await db.exec('COMMIT');
    } catch (e) {
      await db.exec('ROLLBACK');
      throw e;
    }

    await dumpToJson();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /planner/week?weekStart=YYYY-MM-DD
r.get('/week', async (req, res) => {
  try {
    const { weekStart } = req.query;
    const rows = await db.all(
      `SELECT mp.day_index, r.id AS recipe_id, r.title
       FROM meal_plan mp
       JOIN recipes r ON r.id = mp.recipe_id
       WHERE mp.week_start = ?
       ORDER BY mp.day_index`,
      weekStart
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default r;