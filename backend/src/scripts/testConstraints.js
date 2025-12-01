import { db } from "../lib/db.js";

export function testInvalidData() {
// Game table tests
    testGameConstraints();
// Developer table tests
    testDeveloperConstraints();
// Genre table tests
    testGenreConstraints();
// Platform table tests
    testPlatformConstraints();
// Gamer table tests
    testGamerConstraints();
// User table tests
    testUserConstraints();
// Review table tests
    testReviewConstraints();
}

function testGameConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT game_title FROM Game LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO Game (game_title) VALUES (?)`, [rows[0].game_title], (err) => {
            if (err) console.log("Game Test 1:", err.message);
        });
    });
    // 2. release_date constraint violation 
    db.query(`Insert INTO Game (game_title, release_date) VALUES (?,?)`, ['A game', '2026-02-14'], (err) => {
        if (err) console.log("Game Test 2:", err.message);
    });
    // 3. overall_rating constraint violation
    db.query(`Insert INTO Game (game_title, overall_rating) VALUES (?,?)`, ['A game', 6], (err) => {
        if (err) console.log("Game Test 3:", err.message);
    });
}

function testDeveloperConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT dev_name FROM Developer LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO Developer (dev_name) VALUES (?)`, [rows[0].dev_name], (err) => {
            if (err) console.log("Developer Test 1:", err.message);
        });
    });
    // 2. dev_num_games constraint violation
    db.query(`INSERT INTO Developer (dev_name, dev_num_games) VALUES (?,?)`, ['A developer', -1], (err) => {
        if (err) console.log("Developer Test 2:", err.message);
    });
}

function testGenreConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT genre_name FROM Genre LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO Genre (genre_name) VALUES (?)`, [rows[0].genre_name], (err) => {
            if (err) console.log("Genre Test 1:", err.message);
        });
    });
    // 2. genre_num_games constraint violation
    db.query(`INSERT INTO Genre (genre_name, genre_num_games) VALUES (?,?)`, ['A genre', -1], (err) => {
        if (err) console.log("Genre Test 2:", err.message);
    });
}

function testPlatformConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT plat_name FROM Platform LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO Platform (plat_name) VALUES (?)`, [rows[0].plat_name], (err) => {
            if (err) console.log("Platform Test 1:", err.message);
        });
    });
    // 2. plat_num_games constraint violation
    db.query(`INSERT INTO Platform (plat_name, plat_num_games) VALUES (?,?)`, ['A platform', -1], (err) => {
        if (err) console.log("Platform Test 2:", err.message);
    });
}

function testGamerConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT gamer_tag FROM Gamer LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO Gamer (gamer_tag) VALUES (?)`, [rows[0].gamer_tag], (err) => {
            if (err) console.log("Gamer Test 1:", err.message);
        });
    });
    // 2. gamer_dob constraint violation
    db.query(`INSERT INTO Gamer (gamer_tag, gamer_dob) VALUES (?,?)`, ['A gamer tag', '2026-12-31'], (err) => {
        if (err) console.log("Gamer Test 2:", err.message);
    });
}

function testUserConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT username FROM User LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO User (username) VALUES (?)`, [rows[0].username], (err) => {
            if (err) console.log("User Test 1:", err.message);
        });
    });
    // 2. user_dob constraint violation
    db.query(`INSERT INTO User (username, user_dob) VALUES (?,?)`, ['A username', '2026-12-31'], (err) => {
        if (err) console.log("User Test 2:", err.message);
    });
}

function testReviewConstraints() {
    // 1. Primary key uniqueness violation
    db.query(`SELECT rev_id FROM Review LIMIT 1`, (err, rows) => {
        if (err) throw err;
        db.query(`INSERT INTO Review (rev_id) VALUES (?)`, [rows[0].rev_id], (err) => {
            if (err) console.log("Review Test 1:", err.message);
        });
    });
    // 2. rev_id constraint violation
    db.query(`INSERT INTO Review (rev_id) VALUES (?)`, [-1], (err) => {
        if (err) console.log("Review Test 2:", err.message);
    });
    // 3. rev_date constraint violation
    db.query(`INSERT INTO Review (rev_id, rev_date) VALUES (?,?)`, [1000, '2026-01-02'], (err) => {
        if (err) console.log("Review Test 3:", err.message);
    });
    // 4. rating constraint violation
    db.query(`INSERT INTO Review (rev_id, rating) VALUES (?,?)`, [1000, 6], (err) => {
        if (err) console.log("Review Test 4:", err.message);
    });
}