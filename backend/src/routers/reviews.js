import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

router.get("/", (req, res) => {
    db.query(
        `SELECT 
        r.rev_id       AS id,
        r.rev_title    AS title,
        r.rev_text     AS text,
        r.rating       AS rating,
        r.rev_date     AS date,
        r.game_title   AS game_title,
        r.username     AS username
     FROM Review r
     ORDER BY r.rev_date DESC`,
        (err, results = []) => {
            if (err) return res.status(500).json({ error: "DB error", detail: err.message });
            return res.json(results);
        }
    );
});

router.get("/game/:gameTitle", (req, res) => {
    const gameTitle = decodeURIComponent(req.params.gameTitle);

    db.query(
        `SELECT 
        r.rev_id       AS id,
        r.rev_title    AS title,
        r.rev_text     AS text,
        r.rating       AS rating,
        r.rev_date     AS date,
        r.game_title   AS game_title,
        r.username     AS username
     FROM Review r
     WHERE r.game_title = ?
     ORDER BY r.rev_date DESC`,
        [gameTitle],
        (err, results = []) => {
            if (err) return res.status(500).json({ error: "DB error", detail: err.message });
            return res.json(results);
        }
    );
});

router.post("/", (req, res) => {
    const { game_title, username, rev_title, rev_text, rating } = req.body;

    if (!game_title || !username || !rev_title || !rev_text || rating == null) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
    INSERT INTO Review (rev_id, rev_title, rev_text, rev_date, rating, game_title, username)
    VALUES (
      (SELECT COALESCE(MAX(r2.rev_id), 0) + 1 FROM Review r2),
      ?, ?, CURDATE(), ?, ?, ?
    )
  `;

    db.query(sql, [rev_title, rev_text, rating, game_title, username], (err, result) => {
        if (err) return res.status(500).json({ error: "DB insert error", detail: err.message });
        res.json({ success: true, review_id: result.insertId ?? null });
    });
});

export default router;
