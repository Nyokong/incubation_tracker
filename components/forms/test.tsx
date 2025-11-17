"use client";

import getSharedForms, { getAllForms } from "@/data-access/queries/getforms";
import { FormType, QuestionsType } from "@/types/next-auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type FormWithQuestions = {
  form: FormType;
  questionsArr: QuestionsType[];
};

export default function Test() {
  //   const [isResponse, setResponse] = useState<ResponseType[]>([]);

  const [form, setForm] = React.useState<FormWithQuestions>();
  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    async function fetchForm() {
      const data = await getSharedForms("15344d2a-7c4f-4d31-910c-d47b0c038e39");

      // console.log(shareID.shareId);

      if (data) {
        setForm(data);
      }
    }

    fetchForm();
  }, []);

  useEffect(() => {
    async function fetchForms() {
      const forms = await getAllForms();

      setForms(forms);
    }

    fetchForms();
  }, []);

  return (
    <div className="text-white">
      test{form?.form.id}
      {forms.map((entry, idx) => (
        <div key={idx}>
          {entry.id}
          <Link href={`/forms/${entry.shareId}`}>goasda</Link>
        </div>
      ))}
    </div>
  );
}
