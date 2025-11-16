"use server";

import { db } from "@/db";
import { forms, options, questions } from "@/db/schema";
import { FormDraftType, OptionsType, QuestionsType } from "@/types/next-auth";

import { v4 as uuidv4 } from "uuid";

export default async function AddFormNew(form: FormDraftType) {
  // 1. Title check
  if (form.title.trim() === "") {
    return { error: "Error: Form doesn't have a title" };
  }

  // 2. Questions existence check
  if (form.questions.length === 0) {
    return { error: "Error: Can't submit a form with no questions!" };
  }

  // 3. Label check (short-circuit)
  const labelError = form.questions.find((entry) => entry.label.trim() === "");
  if (labelError) {
    return { error: "Error: A question is missing its label" };
  }

  // 4. Options check for checkbox/radio
  const optionError = form.questions.find(
    (entry) =>
      (entry.type === "checkbox" || entry.type === "radio") &&
      entry.options.length === 0
  );
  if (optionError) {
    return {
      error: `Error: Input type ${optionError.type} cannot have zero options`,
    };
  }

  // submit form to the database
  await db.insert(forms).values({
    id: form.formId,
    title: form.title,
    description: form.description,
    status: form.status,
    createdBy: form.createdById,
    shareId: uuidv4(),
  });

  form.questions.map(async (entry: QuestionsType) => {
    await db.insert(questions).values({
      id: `${entry.id}`,
      formId: `${entry.formId}`,
      type: entry.type,
      label: entry.label,
      order: entry.order,
      required: entry.required,
    });

    if (
      (entry.type === "checkbox" || entry.type === "radio") &&
      entry.options.length > 0
    ) {
      entry.options.map(async (op: OptionsType) => {
        await db.insert(options).values({
          questionId: op.questionId,
          label: op.label,
          value: op.value,
        });
      });
    }
  });

  // ✅ Passed all checks
  return { success: true, error: "No-errors All checks clean" };
}
