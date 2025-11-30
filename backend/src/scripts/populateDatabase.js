import axios from "axios";
import { db } from "../lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const RAWG_API = "https://api.rawg.io/api";

export async function populateDatabase() {
    let idStore = await grabIds();
    
    await populateGameTable(idStore);
    await populateDeveloperTable(idStore.developerIds);
    await populateGenreTable(idStore.genreIds);
    await populatePlatformTable(idStore.platformIds);
}

async function grabIds() {
    let pageNum = 1;
    const maxPages = 5;
    const idStore = {gameIds: new Set(), developerIds: new Map(), genreIds: new Map(), platformIds: new Map()};
    while (pageNum <= maxPages) {
        const res = await axios.get(`${RAWG_API}/games`, {
            params: {
                key: process.env.RAWG_API_KEY,
                page: pageNum,
                ordering: "-rating",
                page_size: 40
            }
        });

        const games = res.data.results;

        for (const game of games) {
            idStore.gameIds.add(game.id);
            for (const genre of game.genres) {
                // Add genre id to idstore
                idStore.genreIds.set(genre.id, game.name);
            }
            for (const platform of game.platforms) {
                // Add platform id to idstore
                idStore.platformIds.set(platform.platform.id, game.name);
            }
        }
        pageNum++;
    }
    return idStore;
}

async function populateGameTable(idStore) {
    let todaysDate = new Date().toISOString().slice(0,10);
    let i = 0;
    for (const gameId of idStore.gameIds) {
        // Fetch games by id
        const res = await axios.get(`${RAWG_API}/games/${gameId}`, {
            params: {
                key: process.env.RAWG_API_KEY,
            }
        });
        // Store game data in game
        const game = res.data;
        // Store developer ids (need to grab game by id)
        for (const developer of game.developers) {
            // Add developer id to idstore
            idStore.developerIds.set(developer.id, game.name);
        }
        // Grab games that have been released
        let releasedDate = game.released === null ? todaysDate : game.released;
        if (releasedDate > todaysDate) continue;
        // Insert game into Game table
        const gameQuery = `INSERT INTO Game (game_title, game_description, game_image, release_date, overall_rating) VALUES (?,?,?,?,?)`;
        const values = [game.name, game.description, game.background_image, releasedDate, game.rating];
        db.query(gameQuery, values, (err) => {
            if (err) throw err;
        }); 
        console.log("Game: ", i++);
    }
    console.log("Successfully populated Game table!");
}

async function populateDeveloperTable(developerIds) {
    let i = 0;
    for (const [developerId, gameTitle] of developerIds) {
        // Fetch developers by id
        const res = await axios.get(`${RAWG_API}/developers/${developerId}`, {
            params: {
                key: process.env.RAWG_API_KEY,
            }
        });
        // Store developer data in dev
        const dev = res.data;
        // Insert developer into Developer table
        const devQuery = `INSERT INTO Developer (dev_name, dev_description, dev_num_games, dev_image) VALUES (?,?,?,?)`;
        const dqValues = [dev.name, dev.description, dev.games_count, dev.image_background];
        db.query(devQuery, dqValues, (err) => {
            if (err) throw err;
        });
        // Insert developer name and game title into Develops table
        const developsQuery = `INSERT INTO Develops (dev_name, game_title) VALUES (?,?)`;
        const devsqValues = [dev.name, gameTitle];
        db.query(developsQuery, devsqValues, (err) => {
            if (err) throw err;
        });
        console.log("Developer: ", i++);
    }
    console.log("Successfully populated Developer and Develops tables!");
}

async function populateGenreTable(genreIds) {
    let i = 0;
    for (const [genreId, gameTitle] of genreIds) {
        // Fetch genres by id
        const res = await axios.get(`${RAWG_API}/genres/${genreId}`, {
            params: {
                key: process.env.RAWG_API_KEY,
            }
        });
        // Store genre data in genre
        const genre = res.data;
        // Insert genre into Genre table
        const genreQuery = `INSERT INTO Genre (genre_name, genre_description, genre_image, genre_num_games) VALUES (?,?,?,?)`;
        const gqValues = [genre.name, genre.description, genre.image_background, genre.games_count];
        db.query(genreQuery, gqValues, (err) => {
            if (err) throw err;
        });
        // Insert game title and genre name into Game_Genre
        const gameGenreQuery = `INSERT INTO Game_Genre (game_title, genre_name) VALUES (?,?)`;
        const ggqValues = [gameTitle, genre.name];
        db.query(gameGenreQuery, ggqValues, (err) => {
            if (err) throw err;
        });
        console.log("Genre: ", i++);
    }
    console.log("Successfully populated Genre and Game_Genre tables!");
}

async function populatePlatformTable(platformIds) {
    let i = 0;
    for (const [platformId, gameTitle] of platformIds) {
        // Fetch platforms by id
        const res = await axios.get(`${RAWG_API}/platforms/${platformId}`, {
            params: {
                key: process.env.RAWG_API_KEY,
            }
        });
        // Store platform data in plat
        const plat = res.data;
        // Insert plat into platform table
        const platformQuery = `INSERT INTO Platform (plat_name, plat_description, plat_image, plat_num_games) VALUES (?,?,?,?)`;
        const pqValues = [plat.name, plat.description, plat.image_background, plat.games_count];
        db.query(platformQuery, pqValues, (err) => {
            if (err) throw err;
        });
        // Insert game title and platform name into Played_On
        const playedOnQuery = `INSERT INTO Played_On (game_title, plat_name) VALUES (?,?)`;
        const poqValues = [gameTitle, plat.name];
        db.query(playedOnQuery, poqValues, (err) => {
            if (err) throw err;
        });
        console.log("Platform: ", i++);
    }
    console.log("Successfully populated Platform and Played_On tables!");
}