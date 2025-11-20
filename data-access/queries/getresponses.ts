"use server";

import { db } from "@/db";
import { answers, forms, responses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getResponses(shareid: string) {
  // get form
  const getform = await db
    .select({ id: forms.id })
    .from(forms)
    .where(eq(forms.shareId, shareid));

  if (getform.length === 0) {
    return { data: [], count: 0 };
  }

  // get responses
  const resCount = await db
    .select()
    .from(responses)
    .where(eq(responses.formId, getform[0].id));

  // get answers for each response
  const data = await Promise.all(
    resCount.map(async (entry) => {
      const answersForResponse = await db
        .select()
        .from(answers)
        .where(eq(answers.responseId, entry.id));

      return {
        ...entry,
        answers: answersForResponse,
      };
    })
  );

  return { data, count: resCount.length };
}
