import express from "express";
import cors from "cors";
import { db } from "./src/lib/db.js";
import gameRoutes from './src/routes/games.js';
import gamerRoutes from './src/routes/gamers.js';
import reviewRoutes from './src/routes/reviews.js';

const app = express();

app.use(cors({origin: "http://localhost:5173"}));

app.use("/api/games", gameRoutes);
app.use("/api/gamers", gamerRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})