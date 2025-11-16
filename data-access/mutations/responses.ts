"use server";

import { db } from "@/db";
import { responses } from "@/db/schema";

type ReponseType = {
  id: string;
  formId: string;
  submittedAt: Date | null;
  submittedBy: string | null;
};

export default async function createResponse(res: ReponseType) {
  //   const response = await db.select().from(responses);

  const response = await db.insert(responses).values({
    formId: res.formId,
    submittedBy: res.submittedBy,
  });

  if (response) {
    return { error: "Response logged" };
  }

  return null;
}
