import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET all games
router.get("/", (req, res) => {
    const query = `
        SELECT 
            g.*,
            GROUP_CONCAT(DISTINCT d.dev_name SEPARATOR ', ') AS developers,
            GROUP_CONCAT(DISTINCT po.plat_name SEPARATOR ', ') AS platforms,
            GROUP_CONCAT(DISTINCT gg.genre_name SEPARATOR ', ') AS genres
        FROM Game g
        LEFT JOIN Develops d ON d.game_title = g.game_title
        LEFT JOIN Played_On po ON po.game_title = g.game_title
        LEFT JOIN Game_Genre gg ON gg.game_title = g.game_title
        GROUP BY g.game_title
    `;
    db.query(query, (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

// filter selecting developer, platform, and genre.
router.get("/filter", (req, res) => {
    const { developer = null, platform = null, genre = null } = req.query;

    const sql = `
        SELECT DISTINCT g.*
        FROM Game g
        LEFT JOIN Develops d      ON d.game_title = g.game_title
        LEFT JOIN Played_On po    ON po.game_title = g.game_title
        LEFT JOIN Game_Genre gg   ON gg.game_title = g.game_title
        WHERE (? IS NULL OR d.dev_name = ?)
        AND (? IS NULL OR po.plat_name = ?)
        AND (? IS NULL OR gg.genre_name = ?)
        ORDER BY g.overall_rating DESC, g.release_date DESC
    `;

    const params = [
        developer, developer,
        platform, platform,
        genre, genre
    ];

    db.query(sql, params, (err, rows = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error", details: err });
        }
        return res.json(rows);
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