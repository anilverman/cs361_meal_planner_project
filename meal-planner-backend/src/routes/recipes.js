import { Router } from "express";
import { nanoid } from "nanoid";
import { store } from "../data.js";
const r = Router();

// GET /recipes
r.get("/", async (_req, res) => {
  try {
    const rows = store.recipes.map(({ id, title }) => ({ id, title }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /recipes/:id
r.get("/:id", async (req, res) => {
  try {
    const rec = store.recipes.find(x => x.id === req.params.id);
    if (!rec) return res.status(404).json({ error: "not found" });
    res.json({ ...rec, ingredients: store.ingredients[rec.id] || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /recipes {title, instructions?, ingredients:[{name,qty,unit}]}
r.post("/", async (req, res) => {
  try {
    const { title, instructions, ingredients = [] } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "title required" });
    const id = nanoid();
    store.recipes.unshift({ id, title, instructions: instructions || "" });
    store.ingredients[id] = ingredients;
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});