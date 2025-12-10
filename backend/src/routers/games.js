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
        ORDER BY g.overall_rating DESC
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
        SELECT DISTINCT g.*,
            GROUP_CONCAT(DISTINCT d.dev_name SEPARATOR ', ') AS developers,
            GROUP_CONCAT(DISTINCT po.plat_name SEPARATOR ', ') AS platforms,
            GROUP_CONCAT(DISTINCT gg.genre_name SEPARATOR ', ') AS genres
        FROM Game g
        LEFT JOIN Develops d      ON d.game_title = g.game_title
        LEFT JOIN Played_On po    ON po.game_title = g.game_title
        LEFT JOIN Game_Genre gg   ON gg.game_title = g.game_title
        GROUP BY g.game_title
        HAVING (? IS NULL OR FIND_IN_SET(?, REPLACE(developers, ', ', ',')))
        AND (? IS NULL OR FIND_IN_SET(?, REPLACE(platforms, ', ', ',')))
        AND (? IS NULL OR FIND_IN_SET(?, REPLACE(genres, ', ', ',')))
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
        SELECT *
        FROM Game
        WHERE game_title IN (
            SELECT game_title
            FROM Develops
            WHERE dev_name = ?
        )
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
        SELECT *
        FROM Game
        WHERE game_title IN (
            SELECT po.game_title
            FROM Played_On po
            WHERE po.plat_name = ?
        )
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
        SELECT *
        FROM Game
        WHERE game_title IN (
            SELECT gg.game_title
            FROM Game_Genre gg
            WHERE gg.genre_name = ?
        )
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