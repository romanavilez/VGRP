import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET all genres
router.get("/", (req, res) => {
    db.query("SELECT * FROM Genre", (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

export default router;
