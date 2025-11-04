import express from 'express';
import cors from 'cors';
import './db.js'; // ensure DB is opened + schema created
import recipes from './routes/recipes.js';
import planner from './routes/planner.js';
import shopping from './routes/shopping.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/recipes', recipes);
app.use('/planner', planner);
app.use('/shopping-list', shopping);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));