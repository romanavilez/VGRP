import express from "express";
import { db, ConnectDB } from "./src/lib/db.js";

const app = express();

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})