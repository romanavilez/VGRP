import express from "express";
import { db, ConnectDB } from "./src/lib/db.js";

const app = express();

ConnectDB();