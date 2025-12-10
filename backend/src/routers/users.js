import express from "express";
import { db } from "../lib/db.js";

const router = express.Router();

//get all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM User", (err, results = []) => {
        if (err) return res.status(500).json({ error: "DB error" });
        return res.json(results);
    });
});

router.post("/", (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        "INSERT INTO User (username, email) VALUES (?, ?)",
        [username, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: "DB insert error", detail: err.message });
            return res.json({ success: true, user_id: result.insertId });
        }
    );
});

export default router;
