import { db } from "../lib/db.js";

export const CreateTables = async () => {
    // Game table creation
    const gameTable = `
        CREATE TABLE IF NOT EXISTS Game (
            game_title VARCHAR(200) NOT NULL PRIMARY KEY,
            game_description TEXT,
            game_image VARCHAR(512),
            release_date DATE CHECK(release_date < '2026-01-01'),
            overall_rating DECIMAL(3,2) CHECK(overall_rating BETWEEN 0 AND 5)
        );
    `;
    db.query(gameTable, (err) => {
        if (err) throw err;
        console.log('Game table created!');
    });
    // Gamer table creation
    const gamerTable = `
        CREATE TABLE IF NOT EXISTS Gamer (
            gamer_tag VARCHAR(32) NOT NULL PRIMARY KEY,
            gamer_dob DATE CHECK(gamer_dob < '2026-01-01'),
            bio TEXT,
            avatar VARCHAR(512)
        );
    `;
    db.query(gamerTable, (err) => {
        if (err) throw err;
        console.log("Gamer table created!");
    });
    // User table creation
    const userTable = `
        CREATE TABLE IF NOT EXISTS User (
            username VARCHAR(32) NOT NULL PRIMARY KEY, 
            email VARCHAR(254),
            user_dob DATE CHECK(user_dob <= '2026-01-01'),
            profile_pic VARCHAR(512),
            gamer_tag VARCHAR(32)
        );
    `;
    db.query(userTable, (err) => {
        if (err) throw err;
        console.log("User table created!");
    });
    // Review table creation
    const reviewTable = `
        CREATE TABLE IF NOT EXISTS Review (
            rev_id INT PRIMARY KEY CHECK(rev_id >= 0),
            rev_title TEXT,
            rev_text TEXT,
            rev_date DATE CHECK(rev_date <= '2026-01-01'),
            rating DECIMAL(3,2) CHECK(rating BETWEEN 0 AND 5),
            game_title VARCHAR(200),
            username VARCHAR(32),
            FOREIGN KEY (game_title) REFERENCES Game(game_title),
            FOREIGN KEY (username) REFERENCES User(username)
        );
    `;
    db.query(reviewTable, (err) => {
        if (err) throw err;
        console.log("Review table created!");
    });
    // Developer table creation
    const developerTable = `
        CREATE TABLE IF NOT EXISTS Developer (
            dev_name VARCHAR(256) NOT NULL PRIMARY KEY, 
            dev_description TEXT,
            dev_num_games INT CHECK(dev_num_games > 0),
            dev_image VARCHAR(512)
        );
    `;
    db.query(developerTable, (err) => {
        if (err) throw err;
        console.log("Developer table created!");
    });
    // Genre table creation
    const genreTable = `
        CREATE TABLE IF NOT EXISTS Genre (
            genre_name VARCHAR(64) NOT NULL PRIMARY KEY,
            genre_description TEXT,
            genre_image VARCHAR(512),
            genre_num_games INT CHECK(genre_num_games > 0)
        );
    `;
    db.query(genreTable, (err) => {
        if (err) throw err;
        console.log("Genre table created!");
    });
    // Platform table creation
    const platformTable = `
        CREATE TABLE IF NOT EXISTS Platform (
            plat_name VARCHAR(128) NOT NULL PRIMARY KEY,
            plat_description TEXT,
            plat_image VARCHAR(512),
            plat_num_games INT CHECK(plat_num_games > 0)
        );
    `;
    db.query(platformTable, (err) => {
        if (err) throw err;
        console.log("Platform table created!");
    });
    // Played_On table creation
    const Played_On = `
        CREATE TABLE IF NOT EXISTS Played_On (
            game_title VARCHAR(200),
            plat_name VARCHAR(128),
            FOREIGN KEY (game_title) REFERENCES Game(game_title),
            FOREIGN KEY (plat_name) REFERENCES Platform(plat_name)
        );
    `;
    db.query(Played_On, (err) => {
        if (err) throw err;
        console.log('Played_On table created!');
    });
    // Game_Genre table creation
    const Game_Genre = `
        CREATE TABLE IF NOT EXISTS Game_Genre (
            game_title VARCHAR(200),
            genre_name VARCHAR(64),
            FOREIGN KEY (game_title) REFERENCES Game(game_title),
            FOREIGN KEY (genre_name) REFERENCES Genre(genre_name)
        );
    `;
    db.query(Game_Genre, (err) => {
        if (err) throw err;
        console.log('Game_Genre table created!');
    });
    // Follows table creation
    const Follows = `
        CREATE TABLE IF NOT EXISTS Follows (
            username VARCHAR(32),
            gamer_tag VARCHAR(32),
            FOREIGN KEY (username) REFERENCES User(username),
            FOREIGN KEY (gamer_tag) REFERENCES Gamer(gamer_tag)
        );
    `;
    db.query(Follows, (err) => {
        if (err) throw err;
        console.log('Follows table created!');
    });
    // Plays table creation
    const Plays = `
        CREATE TABLE IF NOT EXISTS Plays (
            gamer_tag VARCHAR(32),
            game_title VARCHAR(200),
            FOREIGN KEY (gamer_tag) REFERENCES Gamer(gamer_tag),
            FOREIGN KEY (game_title) REFERENCES Game(game_title)
        );
    `;
    db.query(Plays, (err) => {
        if (err) throw err;
        console.log('Plays table created!');
    });
    // Develops table creation
    const Develops = `
        CREATE TABLE IF NOT EXISTS Develops (
            dev_name VARCHAR(256),
            game_title VARCHAR(200),
            FOREIGN KEY (dev_name) REFERENCES Developer(dev_name),
            FOREIGN KEY (game_title) REFERENCES Game(game_title)
        );
    `;
    db.query(Develops, (err) => {
        if (err) throw err;
        console.log('Develops table created!');
    });
}