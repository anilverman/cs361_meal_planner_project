import { Router } from "express";
import { store, plans, UID } from "../data.js";
const r = Router();

// GET /shopping-list?weekStart=YYYY-MM-DD
r.get("/", async (req, res) => {
  try {
    const { weekStart } = req.query;
    if (!weekStart) return res.status(400).json({ error: "weekStart required" });

    const key = `${UID}:${weekStart}`;
    const plan = plans.get(key) || [];

    const totals = new Map(); // key: name|unit -> qty sum
    for (const { recipe_id } of plan) {
      const ings = store.ingredients[recipe_id] || [];
      for (const { name, qty, unit } of ings) {
        const k = `${name}|${unit}`;
        totals.set(k, (totals.get(k) || 0) + Number(qty));
      }
    }

    const out = [...totals.entries()].map(([k, total_qty]) => {
      const [name, unit] = k.split("|");
      return { name, unit, total_qty: Math.round(total_qty * 100) / 100 };
    }).sort((a,b)=> a.name.localeCompare(b.name));

    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default r;