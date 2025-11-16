"use client";

import Viewtemplateform from "@/components/forms/viewtemplate";
import { getSharedForms } from "@/data-access/queries/getforms";
import { questions } from "@/db/schema";
import { FormType, QuestionsType } from "@/types/next-auth";

import React, { use } from "react";

type FormWithQuestions = {
  form: FormType;
  questionsArr: QuestionsType[];
};

export default function FormPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const [form, setForm] = React.useState<FormWithQuestions>();
  const shareID = use(params);

  React.useEffect(() => {
    async function fetchForm() {
      const data = await getSharedForms(shareID.shareId);

      // console.log(shareID.shareId);

      if (data) {
        setForm(data);
      }
    }

    fetchForm();
  }, []);

  if (form == undefined)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Form not found
      </div>
    );

  return (
    <div className="px-5 flex flex-col justify-center items-center">
      <Viewtemplateform form={form.form} questionsArr={form.questionsArr} />
    </div>
  );
}
