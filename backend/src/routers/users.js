import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM User", (err, results = []) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        return res.json(results);
    });
});

export default router;