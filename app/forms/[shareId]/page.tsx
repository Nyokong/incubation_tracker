"use client";

// import Viewtemplateform from "@/components/forms/viewtemplate";
import Blackloader from "@/components/loaders/blackloader";
import Whiteloader from "@/components/loaders/whiteloader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import createResponse from "@/data-access/mutations/responses";
import getSharedForms from "@/data-access/queries/getforms";
import { FormType, OptionsType, QuestionsType } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import React, { use, useState, useEffect } from "react";

type ResponseType = {
  questionId: string;
  formId: string;
  value: string;
};

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
  const { data: session, status } = useSession();

  const [isResponse, setResponse] = useState<ResponseType[]>([]);
  const [isLoggedOff, setIsLoggedOff] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    async function fetchForm() {
      const data = await getSharedForms(shareID.shareId);

      // console.log(shareID.shareId);

      if (data) {
        setForm(data);
      }
    }

    fetchForm();
  }, []);

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        {/* {theme === "dark" ? <Whiteloader /> : <Blackloader />} */}
        <Whiteloader />
      </div>
    );
  }

  if (form == undefined)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        {theme == "dark" ? (
          <div className="flex justify-center gap-4 items-center flex-row">
            <p>Form not found</p> <Whiteloader />
          </div>
        ) : (
          <div className="flex justify-center gap-4 items-center flex-row">
            <Blackloader /> <p>Form not found</p>
          </div>
        )}
      </div>
    );

  // Add or update a response
  const handleChange = (questionId: string, value: string, formId: string) => {
    setResponse((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.questionId === questionId || r.formId === formId
      );

      if (existingIndex !== -1) {
        // Only update the value, leave questionId and formId untouched
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          value, // replace just the value
        };
        return updated;
      }

      // Add new response if it doesn't exist yet
      return [...prev, { questionId, formId: formId, value }];
    });
  };

  const handleSubmit = async () => {
    if (status == "unauthenticated") {
      setIsLoggedOff(true);
    }

    const response = await createResponse({
      formId: form.form.id,
      submittedBy: session?.user.id,
    });

    console.log(response);
  };

  return (
    // <div className="p-5 flex flex-col justify-center items-center">
    //   <Viewtemplateform form={form.form} questionsArr={form.questionsArr} />
    // </div>
    <div className="relative flex justify-center flex-col items-center">
      {isLoggedOff && (
        <div className=" w-screen h-full flex justify-center items-center">
          <div className="h-auto w-[300px] bg-red-600 rounded-md my-5 p-5">
            <p>You are not logged in</p>
            <p>Providing your emails helps with reaching out</p>
          </div>
        </div>
      )}

      {(status == "authenticated" && session?.user.role == "staff") ||
        (session?.user.role == "admin" && (
          <div className="w-screen h-10 mb-5 bg-white dark:bg-woodsmoke-800 flex justify-center flex-row items-center gap-4">
            <p className="text-havelock-blue-500 underline underline-offset-2">
              form
            </p>{" "}
            <p>Responses</p>
          </div>
        ))}

      <div className="flex h-auto flex-col gap-3 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] 2xl:w-[50%] mb-10">
        {/* Render questions here */}
        <div className="border-t-8 border-t-[#1d4d8d] rounded-t-md rounded-b-sm bg-[#f4f4f4] dark:bg-woodsmoke-950 h-auto px-3 py-10 flex flex-col gap-4">
          <div className="text-5xl font-medium  ">{form.form.title}</div>
          <div className="flex h-5 items-center mb-3.5">
            {form.form.description}
          </div>
        </div>

        <div className="flex h-auto flex-col gap-3">
          {form.questionsArr.map((entry, idx) => {
            return (
              <div
                key={idx}
                className="min-h-22 bg-[#f4f4f4] dark:bg-woodsmoke-950 rounded-md py-3"
              >
                <div className="min-h-10 flex items-center px-5">
                  {entry.label}
                </div>
                {/* {entry.order} */}
                {/* {entry.required} */}

                <div className="px-5 mb-5">
                  {entry.type == "text" && (
                    <input
                      type="text"
                      name={`${entry.order}`}
                      placeholder={`${entry.label}`}
                      // onMouseLeave={() => {
                      //   console.log("Bully laughs");
                      // }}
                      onBlur={(e) =>
                        handleChange(entry.id, e.target.value, form.form.id)
                      }
                      // onBlur={(e) =>
                      //   console.log("Answer recorded:", {
                      //     id: entry.id,
                      //     value: e.target.value,
                      //   })
                      // }
                      className="h-10 w-full text-black dark:text-white dark:bg-woodsmoke-950 border-b-4 rounded-none border-t-0 border-l-0 border-r-0 border-b-[#265185] focus:bg-[#e5eaec] transition duration-75 ease-in-out shadow-none hover:rounded-none hover:border-t-0 hover:border-l-0 hover:border-r-0 hover:border-b-[#1b4477] focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[#1b4477] focus:ring-0 focus:outline-none hover:ring-0"
                    />
                  )}
                </div>

                <div className="px-5 mb-5">
                  {entry.type == "textarea" && (
                    <textarea
                      name={`${entry.order}`}
                      placeholder={`${entry.label}`}
                      onBlur={(e) =>
                        handleChange(entry.id, e.target.value, form.form.id)
                      }
                      className="min-h-20 w-full text-black p-2 border-b-4 rounded-t-sm border-t border-l border-r focus:bg-[#e5eaec] transition duration-75 ease-in-out shadow-none hover:rounded-none hover:border-t hover:border-l hover:border-r hover:border-b-[#4b7cb8] focus:border-t focus:border-l focus:border-r focus:border-b-[#4b7cb8] focus:ring-0 focus:outline-none hover:ring-0"
                    />
                  )}
                </div>

                <div className="px-5 mb-5">
                  {entry.type == "radio" && (
                    <RadioGroup defaultValue={`${entry.options[0].value}`}>
                      {entry.options.map((entry: OptionsType, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <RadioGroupItem
                            value={`${entry.value}`}
                            id={`${entry.id}`}
                            onBlur={(e) =>
                              handleChange(
                                entry.id,
                                e.target.value,
                                form.form.id
                              )
                            }
                          />
                          <Label htmlFor={`${entry.id}`}>{entry.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>

                <div className="px-5 mb-5 ">
                  {entry.type == "checkbox" && (
                    <span>
                      {entry.options.map((entry: OptionsType, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex flex-row items-center min-h-8 gap-2.5 ">
                            <Checkbox
                              id={`${entry.id}`}
                              onBlur={(e) =>
                                handleChange(
                                  entry.id,
                                  e.target.value,
                                  form.form.id
                                )
                              }
                              className="bg-[#d4d4d4] shadow-sm shadow-[#f3f3f3] dark:shadow-woodsmoke-900 inset-shadow-sm"
                            />
                            <Label htmlFor="terms">{entry.label}</Label>
                          </div>
                        </div>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex h-auto justify-center items-center gap-4 my-2">
          <Button
            className="csbtn bg-[#1e4d8a] h-20 w-62 text-white"
            onClick={() => {
              // console.log(isResponse);
              handleSubmit();
            }}
          >
            Submit Form
          </Button>
        </div>
      </div>

      <div className="text-white">
        {isResponse.length > 0 && (
          <div>
            {isResponse.map((res: ResponseType, idx) => (
              <div key={idx}>
                {res.formId} {res.value} {res.formId}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
