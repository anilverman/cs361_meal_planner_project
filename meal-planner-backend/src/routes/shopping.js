import { Router } from 'express';
import { db } from '../db.js';
const r = Router();

// GET /shopping-list?weekStart=YYYY-MM-DD
r.get('/', async (req, res) => {
  try {
    const { weekStart } = req.query;
    if (!weekStart) return res.status(400).json({ error: 'weekStart required' });

    const rows = await db.all(
      `SELECT ri.name, ri.unit, ROUND(SUM(ri.qty), 2) AS total_qty
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       WHERE mp.week_start = ?
       GROUP BY ri.name, ri.unit
       ORDER BY ri.name`,
      weekStart
    );

    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default r;