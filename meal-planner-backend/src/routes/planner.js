import { Router } from 'express';
import { db } from '../db.js';
import { dumpToJson } from '../backup.js';
const r = Router();

// POST /planner/save {weekStart, entries:[{day_index, meal_slot, recipe_id}]}
r.post('/save', async (req, res) => {
  try {
    const { weekStart, entries = [] } = req.body;
    if (!weekStart) return res.status(400).json({ error: 'weekStart required' });
    // Expect 21 entries (7 days x 3 slots), but allow partial updates too
    await db.exec('BEGIN');
    try {
      const upsert = await db.prepare(`
        INSERT INTO meal_plan (week_start, day_index, meal_slot, recipe_id)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(week_start, day_index, meal_slot)
        DO UPDATE SET recipe_id=excluded.recipe_id`);
      try {
        for (const e of entries) {
          if (e.recipe_id == null) continue; // skip empty selects
          // validate recipe exists
          const exists = await db.get('SELECT id FROM recipes WHERE id=?', e.recipe_id);
          if (!exists) throw new Error(`recipe ${e.recipe_id} not found`);
          await upsert.run(weekStart, e.day_index, e.meal_slot, e.recipe_id);
        }
      } finally { await upsert.finalize(); }
      await db.exec('COMMIT');
    } catch (e) { await db.exec('ROLLBACK'); throw e; }

    await dumpToJson();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /planner/week?weekStart=YYYY-MM-DD
r.get('/week', async (req, res) => {
  try {
    const { weekStart } = req.query;
    const rows = await db.all(
      `SELECT mp.day_index, mp.meal_slot, r.id AS recipe_id, r.title
       FROM meal_plan mp
       JOIN recipes r ON r.id = mp.recipe_id
       WHERE mp.week_start = ?
       ORDER BY mp.day_index, mp.meal_slot`,
      weekStart
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default r;