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

async function seedFormWithQuestions() {
  const user = await db.select({ id: users.id }).from(users).limit(1);
  // 1. Create the form
  const [form] = await db
    .insert(forms)
    .values({
      title: "Default form",
      description: "This is a test form!",
      createdBy: user[0].id,
    })
    .returning();

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
    { title: "Describe your experience.", type: questionTypes[1], options: [] },
    {
      title: "Choose your favorite color.",
      type: questionTypes[2],
      options: [{ label: "red" }, { label: "blue" }, { label: "green" }],
    },
    {
      title: "Select your hobbies.",
      type: questionTypes[3],
      options: [
        { label: "Sports" },
        { label: "Games" },
        { label: "Books" },
        { label: "Driving" },
      ],
    },
  ];

  // 3. Insert 4 questions
  // map through the label array
  // add the questions
  // where type == radio or checkbox lets do some

  labels.map(async (entry, idx) => {
    const qid = uuidv4();
    const [question] = await db
      .insert(questions)
      .values({
        id: qid,
        formId: form.id,
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
          questionId: question.id,
          label: op.label,
          value: op.label,
        }))
      );
    }

    // return question;
  });

  // console.log("Seeded form and questions:", {
  //   form,
  //   questions: insertedQuestions.map(([q]) => q),
  // });
}

seedFormWithQuestions()
  .then(() => console.log("✅ Seed complete"))
  .catch((err) => console.error("❌ Seed error:", err));
