"use client";

import { FormType, QuestionsType } from "@/types/next-auth";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export default function Viewtemplateform({
  form,
  questionsArr,
}: {
  form: FormType;
  questionsArr: QuestionsType[];
}) {
  return (
    <div className="flex h-auto flex-col gap-3 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] 2xl:w-[50%] mb-10">
      {/* Render questions here */}
      <div className="border-t-8 border-t-[#1d4d8d] rounded-t-md rounded-b-sm bg-[#f4f4f4] dark:bg-woodsmoke-950 h-auto px-3 py-5 flex flex-col gap-4">
        <div className="text-5xl font-medium  ">{form.title}</div>
        <div className="flex h-5 items-center mb-3.5">{form.description}</div>
      </div>

      <div className="flex h-auto flex-col gap-3">
        {questionsArr.map((entry, idx) => {
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
                    className="h-10 w-full border-b-4 rounded-none border-t-0 border-l-0 border-r-0 border-b-[#265185] focus:bg-[#e5eaec] transition duration-75 ease-in-out shadow-none hover:rounded-none hover:border-t-0 hover:border-l-0 hover:border-r-0 hover:border-b-[#1b4477] focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[#1b4477] focus:ring-0 focus:outline-none hover:ring-0"
                  />
                )}
              </div>

              <div className="px-5 mb-5">
                {entry.type == "textarea" && (
                  <textarea
                    name={`${entry.order}`}
                    placeholder={`${entry.label}`}
                    className="min-h-20 w-full p-2 border-b-4 rounded-t-sm border-t border-l border-r focus:bg-[#e5eaec] transition duration-75 ease-in-out shadow-none hover:rounded-none hover:border-t hover:border-l hover:border-r hover:border-b-[#4b7cb8] focus:border-t focus:border-l focus:border-r focus:border-b-[#4b7cb8] focus:ring-0 focus:outline-none hover:ring-0"
                  />
                )}
              </div>

              <div className="px-5 mb-5">
                {entry.type == "radio" && (
                  <RadioGroup defaultValue={`${entry.options[0].value}`}>
                    {entry.options.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <RadioGroupItem
                          value={`${entry.value}`}
                          id={`${entry.id}`}
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
                    {entry.options.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex flex-row items-center min-h-8 gap-2.5 ">
                          <Checkbox
                            id={`${entry.id}`}
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
        <Button className="csbtn bg-[#1e4d8a] h-20 w-62 text-white">
          Submit Form
        </Button>
      </div>
    </div>
  );
}
