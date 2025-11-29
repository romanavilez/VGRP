import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "vg_database"
});

export const ConnectDB = () => {
    db.connect(err => {
        if (err) throw err;
        console.log("Connected to MySQL!");
    }); 
}