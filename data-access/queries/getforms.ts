"use server";

import { db } from "@/db";
import { forms, options, questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { asc } from "drizzle-orm";

import { FormType, QuestionsType } from "@/types/next-auth";

export async function getAllForms() {
  const all = await db.select().from(forms);
  return all;
}

export default async function getSharedForms(shareId: string) {
  const rows = await db
    .select()
    .from(forms)
    .leftJoin(questions, eq(forms.id, questions.formId))
    .leftJoin(options, eq(questions.id, options.questionId))
    .where(eq(forms.shareId, shareId))
    .orderBy(asc(questions.order));

  if (rows.length === 0) return null;

  const form: FormType = rows[0].forms;

  const questionsMap = new Map<string, QuestionsType>();

  for (const row of rows) {
    const q = row.questions;
    const o = row.options;

    if (q) {
      if (!questionsMap.has(q.id)) {
        questionsMap.set(q.id, { ...q, options: [] });
      }
      if (o) {
        questionsMap.get(q.id)!.options.push(o);
      }
    }
  }

  const questionsArr: QuestionsType[] = Array.from(questionsMap.values());

  return { form, questionsArr };
}

// export default async function llForms
