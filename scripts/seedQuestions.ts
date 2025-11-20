import { Label } from "@/components/ui/label";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { forms, options, questions, users } from "../db/schema";

import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const db = drizzle(`${process.env.DATABASE_URL!}`);
// Replace with a valid user ID from your users table
// const createdByUserId = "CNeDrCGDZTkt6xY_etQO-";
// Generate a new UUID

// console.log(id);
// Example: "550e8400-e29b-41d4-a716-446655440000"

async function seedQuestions() {
  //   const user = await db.select({ id: users.id }).from(users).limit(1);
  //   // 1. Create the form
  //   const [form] = await db
  //     .insert(forms)
  //     .values({
  //       title: "default form",
  //       description: "This is a form everyone has",
  //       createdBy: user[0].id,
  //     })
  //     .returning();

  const formId = await db.select({ id: forms.id }).from(forms).limit(1);

  // 2. Define question types and labels
  const questionTypes = ["text", "textarea", "radio", "checkbox"] as const;
  // const labels = [
  //   "What is your name?",
  //   "Describe your experience.",
  //   "Choose your favorite color.",
  //   "Select your hobbies.",
  // ];

  const labels = [
    { title: "What is your name?", type: questionTypes[0], options: [] },
    {
      title: "Choose your favorite color.",
      type: questionTypes[2],
      options: [{ label: "red" }, { label: "blue" }, { label: "green" }],
    },
  ];

  // 2. Insert questions
  const insertedQuestions = await Promise.all(
    labels.map(async (entry, idx) => {
      const qid = nanoid(50);

      const [question] = await db
        .insert(questions)
        .values({
          id: qid,
          formId: formId[0].id,
          type: entry.type,
          label: entry.title,
          required: Math.random() < 0.5,
          order: idx + 1,
        })
        .returning();

      // 3. Insert options if needed
      if (["radio", "checkbox"].includes(entry.type) && entry.options?.length) {
        // Insert option rows within the current transaction using the option labels
        await db.insert(options).values(
          entry.options.map((op) => ({
            questionId: qid,
            label: op.label,
            value: op.label,
          }))
        );
      }

      // return question;
    })
  );

  console.log({ questions: insertedQuestions });
}

// seedQuestions()
//   .then(() => console.log("✅ Seed complete"))
//   .catch((err) => console.error("❌ Seed error:", err));
