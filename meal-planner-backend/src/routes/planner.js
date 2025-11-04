import { Router } from "express";
import { store, plans, UID } from "../data.js";
const r = Router();

// POST /planner/generate {weekStart, recipeIds:[7 ids]}
r.post("/generate", async (req, res) => {
  try {
    const { weekStart, recipeIds = [] } = req.body;
    if (!weekStart) return res.status(400).json({ error: "weekStart required" });
    if (recipeIds.length < 7) return res.status(400).json({ error: "need 7 recipeIds" });

    const key = `${UID}:${weekStart}`;
    const arr = [];
    for (let day = 0; day < 7; day++) {
      const recipe_id = recipeIds[day];
      // (Optional) validate recipe exists
      if (!store.recipes.find(r => r.id === recipe_id)) {
        return res.status(400).json({ error: `recipe ${recipe_id} not found` });
      }
      arr.push({ day_index: day, recipe_id });
    }
    plans.set(key, arr);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /planner/week?weekStart=YYYY-MM-DD
r.get("/week", async (req, res) => {
  try {
    const { weekStart } = req.query;
    const key = `${UID}:${weekStart}`;
    const plan = plans.get(key) || [];
    const withTitles = plan.map(p => {
      const rec = store.recipes.find(r => r.id === p.recipe_id);
      return { ...p, title: rec ? rec.title : "(missing)" };
    });
    res.json(withTitles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;