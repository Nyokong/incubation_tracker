import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

const client = postgres(`${DATABASE_URL}`, { prepare: false });

export const db = drizzle(client);
