import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

const db = drizzle(`${process.env.DATABASE_URL!}`);

async function seedSuperAdmin() {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, "callmekay@gmail.com"));
  if (existing.length === 0) {
    // if nothing hash the password
    const hash = await bcrypt.hash("Nyokongadmin@4891", 10);
    await db.insert(users).values({
      firstname: "Khotso",
      lastname: "Nyokong",
      email: "callmekay@gmail.com",
      role: "admin",
      password: `${hash}`,
    });

    console.log("Super admin seeded");
  } else {
    console.log("Super admin already exists");
  }
}

// seedSuperAdmin().catch((err) => {
//   console.error("❌ Seeding failed:", err);
//   process.exit(1);
// });
