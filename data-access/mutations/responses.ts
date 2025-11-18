"use server";

import { db } from "@/db";
import { responses } from "@/db/schema";

type ReponseType = {
  formId: string;
  submittedBy: string;
};

export default async function createResponse(res: ReponseType) {
  //   const response = await db.select().from(responses);

  // console.log(res.submittedBy);

  const response = await db.insert(responses).values({
    formId: res.formId,
    submittedBy: res.submittedBy,
  });

  if (response) {
    return { success: true };
  } else {
    return { error: "Response submission failed!" };
  }
}
