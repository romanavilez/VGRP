import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET all games
router.get("/", (req, res) => {
    db.query("SELECT * FROM Game", (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// GET game by name
router.get("/:title", (req, res) => {
    const { title } = req.params;
    db.query("SELECT * FROM Game WHERE game_title = ?", [decodeURIComponent(title)], (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Game not found" });
        }
        return res.json(results[0]);
    });
});

// GET games by developer
router.get("/filter/developer/:devName", (req, res) => {
    const { devName } = req.params;
    const query = `
        SELECT DISTINCT g.* FROM Game g
        JOIN Develops d ON g.game_title = d.game_title
        WHERE d.dev_name = ?
    `;
    db.query(query, [decodeURIComponent(devName)], (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// GET games by platform
router.get("/filter/platform/:platformName", (req, res) => {
    const { platformName } = req.params;
    const query = `
        SELECT DISTINCT g.* FROM Game g
        JOIN Played_On po ON g.game_title = po.game_title
        WHERE po.plat_name = ?
    `;
    db.query(query, [decodeURIComponent(platformName)], (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// GET games by genre
router.get("/filter/genre/:genreName", (req, res) => {
    const { genreName } = req.params;
    const query = `
        SELECT DISTINCT g.* FROM Game g
        JOIN Game_Genre gg ON g.game_title = gg.game_title
        WHERE gg.genre_name = ?
    `;
    db.query(query, [decodeURIComponent(genreName)], (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// GET games by filter (LARRY)

export default router;