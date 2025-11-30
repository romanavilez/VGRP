import { ConnectDB } from "../lib/db.js";
import { CreateTables } from "./createTables.js";
import { populateDatabase } from "./populateDatabase.js";

ConnectDB();
CreateTables();
await populateDatabase();