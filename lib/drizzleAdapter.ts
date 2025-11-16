import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import * as schema from "@/db/schema";
import { AdapterUser } from "next-auth/adapters";
import { randomUUID } from "crypto";

import { eq } from "drizzle-orm";

export const drizzleAdapter = {
  ...DrizzleAdapter(db, {
    usersTable: schema.users as any,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  async createUser(user: AdapterUser) {
    const tempPassword = `oauth-${randomUUID()}`; // or hash it if needed
    const [createdUser] = await db
      .insert(schema.users)
      .values({
        email: user.email,
        image: user.image ?? null,
        emailVerified: user.emailVerified ?? null,
        password: tempPassword, // required unless defaulted
        role: "user", // required unless defaulted
        firstname: "", // required unless defaulted
        lastname: "", // required unless defaulted
      })
      .returning();

    return {
      id: createdUser.id,
      email: createdUser.email,
      emailVerified: createdUser.emailVerified,
      image: createdUser.image,
      role: createdUser.role,
      firstname:
        `${createdUser.firstname} ${createdUser.lastname}`.trim() || null,
    };
  },

  async getUser(id: string): Promise<AdapterUser | null> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    const user = result[0];

    if (!user) return null;

    return {
      id: user.id,
      firstname: user.firstname,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role, // custom field
    };
  },
  async getSessionAndUser(sessionToken: string) {
    const sessionResult = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.sessionToken, sessionToken))
      .limit(1);

    const session = sessionResult[0];
    if (!session) return null;

    const userResult = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId))
      .limit(1);

    const user = userResult[0];
    if (!user) return null;

    return {
      session: {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.firstname,
        image: user.image,
        role: user.role, // include custom fields if needed
      } as AdapterUser,
    };
  },
};
