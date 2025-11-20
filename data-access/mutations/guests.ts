"use server";

import { db } from "@/db";
import { guests } from "@/db/schema";

export async function getGuestEmail(email: string, formId: string) {
  const sendemail = await db
    .insert(guests)
    .values({ email: email, formId: formId });

  if (!email) {
    return {
      error: "Sending email failed! | please check your network",
      success: false,
    };
  }

  return { error: null, success: true };
}
