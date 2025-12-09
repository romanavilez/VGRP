import express from "express";
import cors from "cors";
import { db } from "./src/lib/db.js";
import gameRoutes from './src/routers/games.js';
import gamerRoutes from './src/routers/gamers.js';
import reviewRoutes from './src/routers/reviews.js';
import platformRoutes from './src/routers/platforms.js';
import genreRoutes from './src/routers/genres.js';
import developerRoutes from './src/routers/developers.js';

const app = express();

app.use(cors());

app.use("/api/games", gameRoutes);
app.use("/api/gamers", gamerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/platforms", platformRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/developers", developerRoutes);

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})