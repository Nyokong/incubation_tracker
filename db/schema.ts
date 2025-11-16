import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  primaryKey,
  foreignKey,
  unique,
  check,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import type { AdapterAccountType } from "@auth/core/adapters";
import { sql } from "drizzle-orm";

const id = nanoid(50);

export const users = pgTable("users", {
  id: text("uID")
    .primaryKey()
    .$defaultFn(() => id)
    .unique(),
  firstname: text("firstname"),
  lastname: text("lastname"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role")
    .$type<"admin" | "staff" | "user">()
    .notNull()
    .default("staff"),
  image: text("image"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const forms = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").default(""),
  status: text("status")
    .$type<"draft" | "published" | "archived">()
    .notNull()
    .default("draft"),
  createdBy: text("createdBy").notNull(), // references users
  createdAt: timestamp("createdAt").defaultNow(),
  shareId: text("shareId").default(nanoid()).unique(), // public identifier
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("formId")
    .notNull()
    .references(() => forms.id),
  type: text("type")
    .$type<"text" | "textarea" | "radio" | "checkbox" | "dropdown">()
    .notNull(),
  label: text("label").notNull(),
  required: boolean("required").default(false),
  order: integer("order").notNull(),
});

export const options = pgTable("options", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("questionId")
    .notNull()
    .references(() => questions.id),
  value: text("value").notNull(),
  label: text("label").notNull(),
});

export const responses = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("formId")
    .notNull()
    .references(() => forms.id),
  submittedAt: timestamp("submittedAt").defaultNow(),
  submittedBy: uuid("submittedBy"), // optional user reference
});

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  responseId: uuid("responseId")
    .notNull()
    .references(() => responses.id),
  questionId: uuid("questionId")
    .notNull()
    .references(() => questions.id),
  value: text("value").notNull(), // could be JSON if multi-select
});
