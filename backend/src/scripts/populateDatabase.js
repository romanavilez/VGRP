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
    await populateGamerTable();
    await populateUserTable();
    await populateReviewTable(idStore.gameIds);
    await populateFollowsTable();
    await populatePlaysTable(idStore.gameIds);
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

// Populates the Gamer table with 20 gamer profiles with unique tags, bios, and avatars
async function populateGamerTable() {
    const gamers = [
        { tag: "Ninja", dob: "1995-03-15", bio: "Competitive FPS player", avatar: "https://i.pravatar.cc/150?img=1" },
        { tag: "Myth", dob: "1998-07-22", bio: "RPG enthusiast and speedrunner", avatar: "https://i.pravatar.cc/150?img=2" },
        { tag: "Ronaldo", dob: "1996-11-30", bio: "Strategy game lover", avatar: "https://i.pravatar.cc/150?img=3" },
        { tag: "Messi", dob: "1999-01-10", bio: "Platformer speedrunner", avatar: "https://i.pravatar.cc/150?img=4" },
        { tag: "Fl67cher", dob: "1994-05-18", bio: "Casual gamer and streamer", avatar: "https://i.pravatar.cc/150?img=5" },
        { tag: "Mr_IR7", dob: "2000-09-05", bio: "Indie game collector", avatar: "https://i.pravatar.cc/150?img=6" },
        { tag: "HuE", dob: "1997-12-25", bio: "Competitive multiplayer player", avatar: "https://i.pravatar.cc/150?img=7" },
        { tag: "N8t3", dob: "1993-04-14", bio: "Dark souls enthusiast", avatar: "https://i.pravatar.cc/150?img=8" },
        { tag: "Tenz", dob: "2001-06-08", bio: "Story-driven game fan", avatar: "https://i.pravatar.cc/150?img=9" },
        { tag: "Elevenz", dob: "1992-02-28", bio: "Retro gaming collector", avatar: "https://i.pravatar.cc/150?img=10" },
        { tag: "Ludwig", dob: "1996-08-12", bio: "Puzzle game solver", avatar: "https://i.pravatar.cc/150?img=11" },
        { tag: "JasonTheWeen", dob: "1999-10-19", bio: "Adventure game lover", avatar: "https://i.pravatar.cc/150?img=12" },
        { tag: "LosPolos", dob: "1995-01-03", bio: "Battle royale player", avatar: "https://i.pravatar.cc/150?img=13" },
        { tag: "Wad", dob: "1997-03-27", bio: "MMO enthusiast", avatar: "https://i.pravatar.cc/150?img=14" },
        { tag: "yusuf7n", dob: "1994-09-11", bio: "Fighting game pro", avatar: "https://i.pravatar.cc/150?img=15" },
        { tag: "Eggster", dob: "2000-05-20", bio: "Simulation game player", avatar: "https://i.pravatar.cc/150?img=16" },
        { tag: "Demon1", dob: "1998-11-06", bio: "Racing game competitor", avatar: "https://i.pravatar.cc/150?img=17" },
        { tag: "S0m", dob: "1996-07-14", bio: "VR game explorer", avatar: "https://i.pravatar.cc/150?img=18" },
        { tag: "senCurry", dob: "1999-04-09", bio: "Sci-fi game lover", avatar: "https://i.pravatar.cc/150?img=19" },
        { tag: "Zellsis", dob: "1993-12-22", bio: "Retro arcade player", avatar: "https://i.pravatar.cc/150?img=20" }
    ];
    
    let i = 0;
    for (const gamer of gamers) {
        const gamerQuery = `INSERT INTO Gamer (gamer_tag, gamer_dob, bio, avatar) VALUES (?,?,?,?)`;
        const gqValues = [gamer.tag, gamer.dob, gamer.bio, gamer.avatar];
        db.query(gamerQuery, gqValues, (err) => {
            if (err) throw err;
        });
        console.log("Gamer: ", i++);
    }
    console.log("Successfully populated Gamer table!");
}

// Populates the User table with 10 users, each linked to one of the 20 gamers
async function populateUserTable() {
    const users = [
        { username: "Ninja", email: "Ninja@gmail.com", dob: "1995-03-15", gamer_tag: "Ninja" },
        { username: "TSM_Myth", email: "Myth@yahoo.com", dob: "1998-07-22", gamer_tag: "Myth" },
        { username: "Ronaldo7", email: "RonaldoRonaldoSIUU@gmail.com", dob: "1996-11-30", gamer_tag: "Ronaldo" },
        { username: "Messi", email: "ItzMessi@gmail.com", dob: "1999-01-10", gamer_tag: "Messi" },
        { username: "Mr_IR7", email: "ir7isme@gmail.com", dob: "2000-09-05", gamer_tag: "Mr_IR7" },
        { username: "Fl67cher67", email: "fletcher6767@outlook.com", dob: "1994-05-18", gamer_tag: "Fl67cher" },
        { username: "Tenzz", email: "Tyson@uw.edu", dob: "2001-06-08", gamer_tag: "Tenz" },
        { username: "Zellsis", email: "Zellz@gmail.com", dob: "1993-12-22", gamer_tag: "Zellsis" },
        { username: "yusuf7n", email: "yousuf@gmail.com", dob: "1994-09-11", gamer_tag: "yusuf7n" },
        { username: "Ludwig", email: "ItzLud@gmail.com", dob: "1996-08-12", gamer_tag: "Ludwig" }
    ];
    
    let i = 0;
    for (const user of users) {
        const userQuery = `INSERT INTO User (username, email, user_dob, gamer_tag) VALUES (?,?,?,?)`;
        const uqValues = [user.username, user.email, user.dob, user.gamer_tag];
        db.query(userQuery, uqValues, (err) => {
            if (err) throw err;
        });
        console.log("User: ", i++);
    }
    console.log("Successfully populated User table!");
}

// Populates the Review table with 40 reviews distributed across games and users
async function populateReviewTable(gameIds) {
    // Get array of game titles from the database since we need them for foreign keys
    db.query(`SELECT game_title FROM Game LIMIT 40`, (err, games) => {
        if (err) throw err;
        if (!games || games.length === 0) {
            console.log("No games found to create reviews for");
            return;
        }
        
        const usernames = ["Ninja", "TSM_Myth", "Ronaldo7", "Fl67cher67", "Mr_IR7", 
                          "Tenzz", "Zellsis", "yusuf7n", "Ludwig", "Messi"];
        const reviewTitles = [
            "Amazing experience!", "Great gameplay", "Highly recommended", "Worth the money", "Epic adventure",
            "Mind-blowing graphics", "Perfect story", "Addictive gameplay", "Best purchase ever", "Absolutely fantastic",
            "Stunning visuals", "Engaging plot", "Outstanding performance", "Must play", "Brilliant design",
            "Captivating adventure", "Incredible soundtrack", "Masterpiece", "10/10 would play again", "Exceeded expectations",
            "Phenomenal game", "Loved every minute", "Exceeded all hopes", "Gaming perfection", "Totally immersed",
            "Unforgettable experience", "Top tier game", "Absolutely stunning", "Best game of the year", "Pure joy",
            "Outstanding craftsmanship", "Incredibly fun", "One for the ages", "Timeless classic", "Gaming excellence",
            "Tremendous fun", "Beautifully crafted", "Simply superb", "Gaming artistry", "Total masterpiece"
        ];
        const reviewTexts = [
            "This game is absolutely incredible! Every moment is filled with excitement and wonder.",
            "I couldn't stop playing. The gameplay mechanics are smooth and intuitive.",
            "The story kept me on the edge of my seat from start to finish.",
            "Graphics are stunning and the world-building is phenomenal.",
            "One of the best gaming experiences I've had in years.",
            "The soundtrack perfectly complements the gameplay.",
            "Highly addictive with great replay value.",
            "A true masterpiece in gaming design.",
            "Exceeded all my expectations in every way.",
            "This should be the gold standard for games.",
            "Absolutely mesmerizing from beginning to end.",
            "The attention to detail is remarkable.",
            "Best investment in gaming I ever made.",
            "Pure magic in video game form.",
            "A game that will stay with me forever."
        ];
        
        let i = 0;
        for (let r = 0; r < 40; r++) {
            const gameIndex = r % games.length;
            const gameTitle = games[gameIndex].game_title;
            const username = usernames[r % usernames.length];
            const rating = (Math.random() * 4 + 1).toFixed(2);
            const daysAgo = Math.floor(Math.random() * 365);
            const reviewDate = new Date();
            reviewDate.setDate(reviewDate.getDate() - daysAgo);
            const reviewDateStr = reviewDate.toISOString().slice(0, 10);
            const titleIndex = Math.floor(Math.random() * reviewTitles.length);
            const textIndex = Math.floor(Math.random() * reviewTexts.length);
            
            const reviewQuery = `INSERT INTO Review (rev_id, rev_title, rev_text, rev_date, rating, game_title, username) VALUES (?,?,?,?,?,?,?)`;
            const rqValues = [r, reviewTitles[titleIndex], reviewTexts[textIndex], reviewDateStr, rating, gameTitle, username];
            db.query(reviewQuery, rqValues, (err) => {
                if (err) throw err;
            });
            console.log("Review: ", i++);
        }
        console.log("Successfully populated Review table!");
    });
}

// Populates the Follows table with follow relationships: users follow several gamers
async function populateFollowsTable() {
    // Get all users and their linked gamer tags
    db.query(`SELECT username, gamer_tag FROM User`, (err, users) => {
        if (err) throw err;
        if (!users || users.length === 0) {
            console.log("No users found to create follows for");
            return;
        }

        // Get all gamer tags
        db.query(`SELECT gamer_tag FROM Gamer`, (err2, gamers) => {
            if (err2) throw err2;
            if (!gamers || gamers.length === 0) {
                console.log("No gamers found to create follows for");
                return;
            }

            const gamerTags = gamers.map(g => g.gamer_tag);
            let inserted = 0;

            for (const user of users) {
                const available = gamerTags.filter(gt => gt !== user.gamer_tag);
                if (available.length === 0) continue;

                // Each user follows between 1 and 10 other gamers
                const numFollows = Math.min(10, Math.max(1, Math.floor(Math.random() * 9) + 1));
                const chosen = new Set();
                while (chosen.size < numFollows) {
                    const pick = available[Math.floor(Math.random() * available.length)];
                    chosen.add(pick);
                }

                for (const gt of chosen) {
                    const q = `INSERT INTO Follows (username, gamer_tag) VALUES (?,?)`;
                    db.query(q, [user.username, gt], (e) => {
                        if (e) throw e;
                    });
                    inserted++;
                }
            }

            console.log("Successfully populated Follows table! Rows inserted:", inserted);
        });
    });
}

// Populates the Plays table with which gamers have played which games
async function populatePlaysTable(gameIds) {
    // Get all gamer tags
    db.query(`SELECT gamer_tag FROM Gamer`, (err, gamers) => {
        if (err) throw err;
        if (!gamers || gamers.length === 0) {
            console.log("No gamers found to create plays for");
            return;
        }

        // Get a set of game titles to use
        db.query(`SELECT game_title FROM Game LIMIT 80`, (err2, games) => {
            if (err2) throw err2;
            if (!games || games.length === 0) {
                console.log("No games found to create plays for");
                return;
            }

            const gameTitles = games.map(g => g.game_title);
            let inserted = 0;

            for (const gamer of gamers) {
                // Each gamer plays between 1 and 6 games
                const numPlays = Math.min(6, Math.max(1, Math.floor(Math.random() * 5) + 1));
                const chosen = new Set();
                while (chosen.size < numPlays) {
                    chosen.add(gameTitles[Math.floor(Math.random() * gameTitles.length)]);
                }

                for (const title of chosen) {
                    const q = `INSERT INTO Plays (gamer_tag, game_title) VALUES (?,?)`;
                    db.query(q, [gamer.gamer_tag, title], (e) => {
                        if (e) throw e;
                    });
                    inserted++;
                }
            }

            console.log("Successfully populated Plays table! Rows inserted:", inserted);
        });
    });
}