import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET all gamers
router.get("/", (req, res) => {
    db.query("SELECT * FROM Gamer", (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// GET games a gamer plays
router.get("/:gamerTag/games", (req, res) => {
    const { gamerTag } = req.params;
    const query = `
        SELECT DISTINCT g.* FROM Game g
        JOIN Plays p ON g.game_title = p.game_title
        WHERE p.gamer_tag = ?
    `;
    db.query(query, [decodeURIComponent(gamerTag)], (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

export default router;