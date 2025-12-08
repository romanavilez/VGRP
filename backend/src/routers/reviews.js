import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET all reviews
router.get("/", (req, res) => {
    db.query("SELECT * FROM Review", (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// GET all reviews for a specific game
router.get("/game/:gameTitle", (req, res) => {
    const { gameTitle } = req.params;

    db.query(
        "SELECT * FROM Review WHERE game_title = ? ORDER BY rev_date DESC",
        [decodeURIComponent(gameTitle)],
        (err, results = []) => {
            if (err) {
                return res.status(500).json({ error: "DB error" });
            }
            return res.json(results);
        }
    );
});

export default router;