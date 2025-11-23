"use server";

import { db } from "@/db";
import { answers, forms, questions, responses } from "@/db/schema";
import { Answer } from "@/types/next-auth";
import { eq, inArray } from "drizzle-orm";

// define a local type that matches the DB row for responses to avoid colliding with the global Fetch Response
type DBResponse = {
  id: string;
  formId: string;
  submittedAt: Date | null;
  submittedBy: string | null;
};

type ResponseWithAnswers = DBResponse & { answers: Answer[] };

export async function getResponses(shareid: string) {
  // get form
  const getform = await db
    .select({ id: forms.id })
    .from(forms)
    .where(eq(forms.shareId, shareid));

  if (getform.length === 0) return { data: {}, count: 0 };

  const responsesForForm = await db
    .select()
    .from(responses)
    .where(eq(responses.formId, getform[0].id));

  if (responsesForForm.length === 0)
    return { data: {} as Record<string, ResponseWithAnswers[]>, count: 0 };

  const responseIds = responsesForForm.map((r) => r.id);

  // 2) Fetch all answers for those responses in one query (with question labels)
  const answersAll = await db
    .select({
      id: answers.id,
      questionId: answers.questionId,
      value: answers.value,
      label: questions.label,
      responseId: answers.responseId,
    })
    .from(answers)
    .innerJoin(questions, eq(answers.questionId, questions.id))
    .where(inArray(answers.responseId, responseIds));

  // 3) Index answers by responseId (each response gets its own array)
  const answersByResponseId = answersAll.reduce((acc, a) => {
    if (!acc[a.responseId]) acc[a.responseId] = [];
    acc[a.responseId].push(a);
    return acc;
  }, {} as Record<string, Answer[]>);

  // 4) Attach answers to their response (ensure new arrays, no shared refs)
  const responsesWithAnswers: ResponseWithAnswers[] = responsesForForm.map(
    (r) => ({
      id: r.id,
      formId: r.formId,
      submittedAt: r.submittedAt,
      submittedBy: r.submittedBy,
      answers: answersByResponseId[r.id] ?? [],
    })
  );

  // 5) Group by submittedBy (keep submissions separate)
  const groupedByUser = responsesWithAnswers.reduce((acc, r) => {
    const key = r.submittedBy ?? "Anonymous";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {} as Record<string, ResponseWithAnswers[]>);

  return {
    data: responsesWithAnswers,
    count: responsesForForm.length,
    grouped: groupedByUser,
  };
}
