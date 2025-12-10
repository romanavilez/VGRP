import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
    db.query(
        `SELECT r.id, r.title, r.text, r.rating, r.created_at,
                g.title AS game_title,
                gm.username AS gamer_name
         FROM Review r
         JOIN Game g ON r.game_id = g.id
         JOIN Gamer gm ON r.gamer_id = gm.id
         ORDER BY r.created_at DESC`,
        (err, results = []) => {
            if (err) return res.status(500).json({ error: "DB error", detail: err.message });
            return res.json(results);
        }
    );
});

router.get("/game/:gameTitle", (req, res) => {
    const gameTitle = decodeURIComponent(req.params.gameTitle);

    db.query(
        `SELECT r.id, r.title, r.text, r.rating, r.created_at,
                gm.username AS gamer_name
         FROM Review r
         JOIN Game g ON r.game_id = g.id
         JOIN Gamer gm ON r.gamer_id = gm.id
         WHERE g.title = ?
         ORDER BY r.created_at DESC`,
        [gameTitle],
        (err, results = []) => {
            if (err) return res.status(500).json({ error: "DB error", detail: err.message });
            return res.json(results);
        }
    );
});

router.post("/", (req, res) => {
    const { game_id, gamer_id, title, text, rating } = req.body;

    if (!game_id || !gamer_id || !title || !text || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        `INSERT INTO Review (game_id, gamer_id, title, text, rating)
         VALUES (?, ?, ?, ?, ?)`,
        [game_id, gamer_id, title, text, rating],
        (err, result) => {
            if (err) return res.status(500).json({ error: "DB insert error", detail: err.message });
            res.json({ success: true, review_id: result.insertId });
        }
    );
});

export default router;
