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

// POST create new user
router.post("/signup", (req, res) => {
    const { username, email, password, birthdate, gamertag} = req.body;
    
    if (!username || !email|| !password || !birthdate || !gamertag) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        "INSERT INTO User (username, email, password, user_dob, gamer_tag) VALUES (?,?,?,?,?)",
        [username, email, password, birthdate, gamertag],
        (err, result) => {
            if (err) return res.status(500).json({ error: "DB insert error", detail: err.message });
            return res.json({ success: true, user_id: result.insertId });
        }
    );
});

// GET user by username and password (for login)
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        "SELECT * FROM User WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error", detail: err.message });

            if (result.length === 0) {
                // Username not found
                return res.status(401).json({ error: "Invalid username or password" });
            }

            return res.status(200).json({
                message: "User authenticated successfully",
                user: result[0]
            });
        }
    );
})

export default router;
