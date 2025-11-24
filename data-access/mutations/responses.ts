"use server";

import { db } from "@/db";
import { responses, answers } from "@/db/schema";
import { FormDraftType, QuestionsAnswerType } from "@/types/next-auth";
import { eq } from "drizzle-orm";

type ReponseType = {
  formId: string;
  questions: QuestionsAnswerType[];
  submittedBy: string;
};

export async function createResponse(res: ReponseType) {
  //   const response = await db.select().from(responses);

  // console.log(res.submittedBy);

  const inserted = await db
    .insert(responses)
    .values({
      formId: res.formId,
      submittedBy: res.submittedBy,
    })
    .returning({ id: responses.id });

  // const response = await db
  //   .select({ id: responses.id })
  //   .from(responses)
  //   .where(eq(responses.formId, res.formId));

  if (inserted) {
    res.questions.forEach(async (entry) => {
      await db.insert(answers).values({
        responseId: inserted[0].id,
        questionId: entry.questionId,
        value: JSON.stringify({ value: entry.value, type: entry.type }),
      });
    });

    return { success: true };
  } else {
    return { error: "Response submission failed!" };
  }
}

export async function answersRecord(res: FormDraftType[]) {
  const res_response = await db
    .select({ id: responses.id })
    .from(responses)
    .where(eq(responses.formId, res[0].formId));

  res.forEach((entry) => {});
}
