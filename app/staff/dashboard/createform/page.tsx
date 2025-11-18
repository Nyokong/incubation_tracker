"use client";

import { Label } from "@/components/ui/label";
import { OptionsType } from "@/types/next-auth";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconPlus,
} from "@tabler/icons-react";
import { formReducer } from "./formReducer";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { options } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { AddFormNew } from "@/data-access/mutations/submitforms";
import { useGlobalNotify } from "@/context/globalnotifcations";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import Whiteloader from "@/components/loaders/whiteloader";
import { motion } from "motion/react";
import { redirect } from "next/navigation";

type QuestionType = "text" | "textarea" | "radio" | "checkbox";

// type FormInnitType = {
//   title: string;
//   descriprion: string;
//   questions: QuestionsType[];
// };

// type CreateQuestionType = { questions: QuestionsType[] };

export default function Createformpage() {
  // const id = nanoid(40);
  const { data: session, status } = useSession();

  const [isAddTitle, setAddIsTitle] = useState(false);
  const [isTitle, setTitle] = useState("");

  const [isSubmitLoader, setSubmitLoader] = useState(false);

  const radioAddOption = useRef<HTMLInputElement | null>(null);

  const [titleHeight, setTitleHeight] = useState(8); // default height in Tailwind units
  const [titleRow, setTitleRow] = useState(1);

  const {
    setGlobalNotification,
    setGlobalsuccessMessage,
    setGlobalErrorMessage,
    globalErrorMessage,
  } = useGlobalNotify();

  const [isDefaultOption, setOptionDefault] = useState("");
  const [isOptionIndex, setIsOptionIndex] = useState(0);

  const isTitleRef = useRef<HTMLInputElement>(null);
  const isPageDiv = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // const notifRef = useRef<HTMLDivElement>(null);
  // const [prevScroll, setPrevScroll] = useState<number | null>(null);

  // set up an array in useState for Questions

  const [form, dispatch] = useReducer(formReducer, {
    title: "",
    description: "",
    questions: [], // ordered list
    status: "draft",
    updatedAt: 0,
    createdById: "",
    formId: `${uuidv4()}`,
  });

  // useEffect(() => {
  //   if (globalNotification && notifRef.current) {
  //     // Save current scroll position
  //     setPrevScroll(window.scrollY);

  //     // Scroll to notification
  //     notifRef.current.scrollIntoView({ behavior: "smooth" });

  //     // Optionally scroll back after a delay
  //     const timer = setTimeout(() => {
  //       if (prevScroll !== null) {
  //         window.scrollTo({ top: prevScroll, behavior: "smooth" });
  //       }
  //     }, 5000); // 3s delay

  //     return () => clearTimeout(timer);
  //   }
  // }, [globalNotification]);

  useEffect(() => {
    if (isAddTitle) {
      isTitleRef.current?.focus();
    }
    const handleClick = (e: MouseEvent) => {
      if (!isAddTitle) return;

      const target = e.target as Node;

      // If user clicked the Add button, do nothing here
      if (addButtonRef.current?.contains(target)) {
        if (isTitle != "") {
          setAddIsTitle(false);
        }

        return;
      }

      // Otherwise, force focus back to input
      isTitleRef.current?.focus();
    };

    const pageDiv = isPageDiv.current;
    pageDiv?.addEventListener("click", handleClick);

    return () => {
      pageDiv?.removeEventListener("click", handleClick);
    };
  }, [isAddTitle]);

  async function submitFormData() {
    // console.log(form);

    const submit = await AddFormNew(form);

    if (submit != undefined) {
      setGlobalNotification(true);

      if (submit.success) {
        setGlobalsuccessMessage(submit.error);
        setSubmitLoader(false);

        dispatch({ type: "RESET_FORM" });
      } else {
        setGlobalErrorMessage(submit.error);
        setSubmitLoader(false);
      }

      // console.log(isSubmitError);
    }
  }

  if (status == "loading") {
    return (
      <div className="h-[70vh] flex justify-center items-center overflow-hidden">
        <Loading />
      </div>
    );
  }

  // if not logged in kick him out
  if (status == "unauthenticated") {
    return redirect("/");
  }

  // if logged in but not staff or admin
  if (status == "authenticated") {
    if (session.user.role == "user") {
      return redirect("/");
    }
  }

  return (
    <div
      ref={isPageDiv}
      className="flex flex-col justify-between items-center px-2 h-screen"
    >
      {isSubmitLoader && (
        <div className="dark:bg-woodsmoke-900 w-full h-full"></div>
      )}
      <div className="flex flex-col gap-3 w-[95%] sm:w-[85%] md:w-[65%] lg:w-[55%] 2xl:w-[50%] mb-2">
        {/* <div className="border-t-8 border-t-havelock-blue-700 rounded-t-md rounded-b-sm bg-[#f4f4f4] dark:bg-woodsmoke-950 h-auto px-3 py-7 flex flex-col gap-4 w-full items-center">
          {!isAddTitle ? (
            <div
              className="flex items-center justify-between pr-5 w-full flex-row gap-3"
              onClick={() => setAddIsTitle(true)}
            >
              <Label className="text-3xl font-medium">
                {isTitle == "" ? "Add Title" : isTitle}
              </Label>
              {isTitle == "" ? <IconPlus /> : <IconPencilPlus />}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center flex-row gap-2">
              <input
                ref={isTitleRef}
                type="text"
                defaultValue={isTitle}
                onChange={(e) => setTitle(e.target.value)}
                className="borderlessInput transition-all duration-150 ease-in-out px-2 w-full h-[50px] bg-woodsmoke-100 text-3xl font-medium"
              />
              <button
                ref={addButtonRef}
                className="h-10 w-10 bg-woodsmoke-100  flex justify-center items-center"
                onClick={() => setAddIsTitle(false)}
              >
                {" "}
                <IconPlus />
              </button>
            </div>
          )}

          {!isAddDescript ? (
            <div
              className="flex justify-between pr-5 flex-wrap gap-2 items-center w-full"
              onClick={() => setAddDescript(true)}
            >
              {!isDescript ? <p>description goes here</p> : <p>{isDescript}</p>}
              {!isDescript ? <IconPlus /> : <IconPencilPlus />}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center flex-row gap-2">
              <textarea
                defaultValue={isDescript}
                onChange={(e) => setIsDescript(e.target.value)}
                className="borderlessInput transition-all duration-150 ease-in-out px-2 w-full min-h-20 bg-woodsmoke-100 font-medium"
              />
              <button
                className="h-10 w-10 bg-woodsmoke-100  flex justify-center items-center"
                onClick={() => setAddDescript(false)}
              >
                {" "}
                <IconPlus />
              </button>
            </div>
          )}
        </div> */}
        {/* 
        <div className="border-t-8 border-t-havelock-blue-700 rounded-t-md rounded-b-sm bg-[#f4f4f4] dark:bg-woodsmoke-950 h-auto px-3 py-7 flex flex-col gap-4 w-full items-center">
          {!isAddTitle ? (
            <div
              className="flex items-center justify-between pr-5 w-full flex-row gap-3"
              onClick={() => setAddIsTitle(true)}
            >
              <Label className="text-3xl font-medium">
                {isTitle == "" ? "Add Title" : isFormInitial?.title}
              </Label>
              {isTitle == "" ? <IconPlus /> : <IconPencilPlus />}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center flex-row gap-2">
              <input
                ref={isTitleRef}
                type="text"
                defaultValue={isTitle}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="borderlessInput transition-all duration-150 ease-in-out px-2 w-full h-[50px] bg-woodsmoke-100 text-3xl font-medium"
              />
              <button
                ref={addButtonRef}
                className="h-10 w-10 bg-woodsmoke-100  flex justify-center items-center"
                onClick={() => setAddIsTitle(false)}
              >
                {" "}
                <IconPlus />
              </button>
            </div>
          )}

          {!isAddDescript ? (
            <div
              className="flex justify-between pr-5 flex-wrap gap-2 items-center w-full"
              onClick={() => setAddDescript(true)}
            >
              {!isDescript ? <p>description goes here</p> : <p>{isDescript}</p>}
              {!isDescript ? <IconPlus /> : <IconPencilPlus />}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center flex-row gap-2">
              <textarea
                defaultValue={isDescript}
                onChange={(e) => setIsDescript(e.target.value)}
                className="borderlessInput transition-all duration-150 ease-in-out px-2 w-full min-h-20 bg-woodsmoke-100 font-medium"
              />
              <button
                className="h-10 w-10 bg-woodsmoke-100  flex justify-center items-center"
                onClick={() => setAddDescript(false)}
              >
                {" "}
                <IconPlus />
              </button>
            </div>
          )}
        </div> */}

        {status == "authenticated" && (
          <div className="fixed hidden md:block bottom-10 right-10 z-50 text-[10px]  bg-green-600 rounded-full shadow-sm text-white px-5 py-2">
            <p>Logged in</p>
          </div>
        )}

        <div className="mt-5">
          <div className="border-t-8 border-t-[#1d4d8d] rounded-t-md rounded-b-sm bg-[#f8f8f8] dark:bg-woodsmoke-950 h-auto px-3 py-10 flex flex-col gap-4 mb shadow-sm">
            <div className="text-5xl font-medium  px-5">
              <textarea
                placeholder="Form title"
                value={form.title}
                onChange={(e) => {
                  console.log([titleRow, e.target.value.length]);

                  if (e.target.value.length > 14) {
                    setTitleHeight(20); // triggers re-render
                    setTitleRow(2);
                  }

                  if (e.target.value.length > 30) {
                    setTitleHeight(30); // triggers re-render
                    setTitleRow(3);
                  } else {
                    setTitleHeight(8);
                    setTitleRow(1);
                  }

                  dispatch({
                    type: "SET_FORM_META",
                    title: e.target.value,
                  });
                }}
                className={`w-full ${
                  titleRow > 2 && `h-${titleRow}`
                } resize-none overflow-hidden text-2xl borderlessInput font-bold`}
                rows={titleRow}
                maxLength={60}
              />
            </div>
            <div className="flex flex-wrap items-center mb-1 px-5">
              <textarea
                className="w-full borderlessInput px-1 min-h-10"
                placeholder="Form description"
                value={form.description}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FORM_META",
                    description: e.target.value,
                  })
                }
                maxLength={120}
              />
            </div>
          </div>

          <div className=" rounded-t-md rounded-b-sm  h-auto  flex flex-col gap-4 w-full items-center ">
            {form.questions.map((q) => (
              <div
                key={q.id}
                className="relative w-full flex justify-center items-center flex-col-reverse md:flex-row gap-2 px-2 md:px-10 md:pb-10 pb-2 pt-2 mt-5 rounded-xl bg-[#f5f5f5] dark:bg-woodsmoke-950 shadow-sm  "
              >
                {globalErrorMessage && (
                  <div className="absolute -top-10 z-20 bg-red-600 text-white rounded-4xl shadow-md dark:shadow-woodsmoke-100 shadow-woodsmoke-900 flex justify-center items-center px-10 py-2">
                    {globalErrorMessage}
                  </div>
                )}
                <div className="md:absolute md:top-18 gap-3 py-4 md:-right-15 flex flex-row md:flex-col justify-between items-center ">
                  <button
                    className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-4xl bg-havelock-blue-700 dark:bg-woodsmoke-700"
                    onClick={() => {
                      if (q.order !== 0) {
                        const prevQuestion = form.questions.find(
                          (question) => question.order === q.order - 1
                        );

                        // Swap positions
                        dispatch({
                          type: "REORDER_QUESTIONS",
                          from: q.order,
                          to: q.order - 1,
                        });

                        // Update current question
                        dispatch({
                          type: "UPDATE_QUESTION",
                          id: q.id,
                          patch: { order: q.order - 1 },
                        });

                        // Update the previous one
                        if (prevQuestion) {
                          dispatch({
                            type: "UPDATE_QUESTION",
                            id: prevQuestion.id,
                            patch: { order: q.order },
                          });
                        }
                      }
                    }}
                  >
                    <IconCaretUpFilled color="white" />
                  </button>

                  {/* <p className="text-black dark:text-white h-15 w-15 flex justify-center items-center">
                    {q.order}
                  </p> */}

                  <button
                    className="cursor-pointer w-8 h-8 flex justify-center items-center rounded-4xl bg-red-700 dark:bg-woodsmoke-700"
                    onClick={() => {
                      if (q.order !== form.questions.length - 1) {
                        const nextQuestion = form.questions.find(
                          (question) => question.order === q.order + 1
                        );

                        // Swap positions
                        dispatch({
                          type: "REORDER_QUESTIONS",
                          from: q.order,
                          to: q.order + 1,
                        });

                        // Update current question
                        dispatch({
                          type: "UPDATE_QUESTION",
                          id: q.id,
                          patch: { order: q.order + 1 },
                        });

                        // Update the next one
                        if (nextQuestion) {
                          dispatch({
                            type: "UPDATE_QUESTION",
                            id: nextQuestion.id,
                            patch: { order: q.order },
                          });
                        }
                      }
                    }}
                  >
                    <IconCaretDownFilled color="white" />
                  </button>
                </div>
                <motion.div
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex flex-col gap-4"
                >
                  <div className="w-full flex justify-between items-center flex-row">
                    <button
                      className="m-2 w-8 h-8 rounded-4xl bg-amber-800 flex justify-center items-center"
                      onClick={() => {
                        dispatch({
                          type: "REMOVE_QUESTION",
                          id: q.id,
                        });
                      }}
                    >
                      <Trash2 color="white" size={14} />
                    </button>

                    <div className="flex p-2 flex-row items-center gap-2 justify-center px-4">
                      <Label>Required?</Label>
                      <Checkbox
                        defaultChecked={q.required}
                        onCheckedChange={(e) => {
                          // console.log(q.required);
                          if (e != "indeterminate") {
                            dispatch({
                              type: "UPDATE_QUESTION",
                              id: q.id,
                              patch: { required: Boolean(e) }, // use the new state
                            });
                          }
                        }}
                        className=" border border-woodsmoke-500"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-row items-center justify-end gap-2.5">
                    {/* Type selector */}
                    <h4>select type:</h4>
                    <Select
                      // defaultValue={q.type}
                      onValueChange={(e) => {
                        dispatch({
                          type: "UPDATE_QUESTION",
                          id: q.id,
                          patch: { type: e as QuestionType },
                        });
                        console.log(q.id, q.type, e);
                      }}
                    >
                      <SelectTrigger className="w-[180px] h-[50px] rounded-md bg-[#ebebeb] justify-between items-center">
                        <SelectValue
                          className=" h-[50px]"
                          placeholder="Select Type"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-[300px] md:w-100">
                        <SelectGroup>
                          <SelectLabel>Service Options</SelectLabel>
                          <SelectItem value="text">Short Text</SelectItem>
                          <SelectItem value="textarea">Paragraph</SelectItem>
                          <SelectItem value="radio">Multiple Choice</SelectItem>
                          <SelectItem value="checkbox">Checkboxes</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <input
                    placeholder="What is your question?"
                    value={q.title}
                    className="borderlessInput transition-all duration-75 ease-in-out px-2 w-full h-10 bg-woodsmoke-100 dark:bg-woodsmoke-900 text-md rounded-t-md focus:border-b-3 focus:border-b-havelock-blue-800 "
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_QUESTION",
                        id: q.id,
                        patch: { label: e.target.value },
                      })
                    }
                  />

                  {q.type == "text" && (
                    <div className="w-full">
                      <input
                        placeholder="answer here!"
                        value={q.title}
                        className="borderlessInput border-b-3 border-b-havelock-blue-800 pointer-events-none transition-all duration-75 ease-in-out px-2 w-full h-[50px] mt-2 text-sm rounded-t-md font-medium"
                      />
                    </div>
                  )}

                  {q.type == "textarea" && (
                    <div className="w-full">
                      <textarea
                        placeholder="answer here!"
                        value={q.title}
                        className="borderlessInput transition-all duration-75 ease-in-out px-2 w-full min-h-[100px] dark:text-white bg-woodsmoke-100 text-2xl rounded-md font-medium"
                      />
                    </div>
                  )}

                  {/* Options editor only if radio/checkbox */}
                  {q.type == "radio" && (
                    <div className="w-full mt-5">
                      <RadioGroup defaultValue={isDefaultOption}>
                        {q.options.length > 0 &&
                          q.options.map((item: OptionsType, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 w-full justify-start"
                            >
                              <RadioGroupItem
                                id={`${idx}`}
                                value={item.value}
                                className="pointer-events-none bg-havelock-blue-200 shadow-sm shadow-woodsmoke-400 inset-shadow-sm inset-shadow-woodsmoke-100 h-5 w-5 flex justify-center "
                              />
                              <Label>{item.label}</Label>
                            </div>
                          ))}
                      </RadioGroup>
                      {q.options.length > 0 && (
                        <div className="my-4">
                          <Separator />
                        </div>
                      )}
                      <RadioGroup>
                        <div className="flex items-center gap-3 w-full justify-start">
                          {/* <RadioGroupItem
                            value="default"
                            className="pointer-events-none bg-havelock-blue-200 shadow-sm shadow-woodsmoke-400 inset-shadow-sm inset-shadow-woodsmoke-100 h-5 w-5 flex justify-center "
                          /> */}
                          <input
                            ref={radioAddOption}
                            placeholder={`option ${1}`}
                            onChange={(e) => setOptionDefault(e.target.value)}
                            className="borderlessInput bg-havelock-300 dark:text-white dark:bg-woodsmoke-900 text-md border-b-2 border-b-havelock-blue-800  transition-all duration-75 ease-in-out px-2 w-full h-auto py-2 bg-havelock-blue-100  text-md rounded-t-md "
                          />
                          <button
                            className="cursor-pointer w-14 h-10 rounded-4xl bg-havelock-blue-600 text-white flex justify-center gap-2 items-center"
                            onClick={() => {
                              if (isDefaultOption != "") {
                                setOptionDefault((prev) => prev + 1);
                                dispatch({
                                  type: "ADD_OPTION",
                                  qid: q.id,
                                  index: isOptionIndex,
                                  option: {
                                    id: uuidv4(),
                                    questionId: q.id,
                                    value: isDefaultOption,
                                    label: isDefaultOption,
                                  },
                                });

                                if (radioAddOption.current) {
                                  // clear input after option added
                                  setOptionDefault("");
                                  radioAddOption.current.value = "";
                                }
                              } else {
                                setGlobalNotification(true);
                                setGlobalErrorMessage("Radio input is Empty!");
                              }
                            }}
                          >
                            <IconPlus size={20} />
                          </button>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Options editor only if radio/checkbox */}
                  {q.type == "checkbox" && (
                    <div className="w-full mt-5">
                      {q.options.length > 0 &&
                        q.options.map((item: OptionsType, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 w-full justify-start my-2"
                          >
                            <Checkbox
                              id={`${idx}`}
                              value={item.value}
                              className=" pointer-events-none bg-havelock-blue-200 shadow-sm shadow-woodsmoke-400 inset-shadow-sm inset-shadow-woodsmoke-100 h-5 w-5 flex justify-center "
                            />
                            <Label>{item.label}</Label>
                          </div>
                        ))}

                      {q.options.length > 0 && (
                        <div className="my-4">
                          <Separator />
                        </div>
                      )}

                      <div className="flex items-center gap-3 w-full justify-start">
                        <Checkbox
                          value="default"
                          className="pointer-events-none bg-havelock-blue-200 shadow-sm shadow-woodsmoke-400 inset-shadow-sm inset-shadow-woodsmoke-100 h-5 w-5 flex justify-center "
                        />
                        <input
                          placeholder={`option ${1}`}
                          onChange={(e) => setOptionDefault(e.target.value)}
                          className="borderlessInput bg-havelock-300 dark:text-white dark:bg-woodsmoke-900 border-b-2 border-b-havelock-blue-800  transition-all duration-75 ease-in-out px-2 w-full h-auto py-2 bg-havelock-blue-100  text-md rounded-t-md "
                        />
                        <button
                          className="w-25 h-10 rounded-md bg-havelock-blue-600 text-white flex justify-center gap-2 items-center"
                          onClick={() => {
                            if (isDefaultOption != "") {
                              setOptionDefault((prev) => prev + 1);
                              dispatch({
                                type: "ADD_OPTION",
                                qid: q.id,
                                index: isOptionIndex,
                                option: {
                                  id: uuidv4(),
                                  questionId: q.id,
                                  value: isDefaultOption,
                                  label: isDefaultOption,
                                },
                              });
                            }
                          }}
                        >
                          add <IconPlus size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="hidden"
          onClick={() => {
            console.log(form);
          }}
        >
          add option
        </button>

        {/* <div className="flex justify-center items-center p-4 bg-[#f4f4f4] dark:bg-woodsmoke-950 rounded-sm">
        </div> */}

        <div className="flex justify-center items-center py-4 rounded-sm">
          <button
            className="h-12 w-60 flex justify-center items-center gap-3 text-black dark:text-shadow-woodsmoke-900 rounded-4xl bg-[#eeeeee] dark:bg-woodsmoke-300 cursor-pointer shadow-sm shadow-woodsmoke-400"
            onClick={() => {
              // dispatch({
              //   type: "SET_FORMID",
              //   formId: uuidv4(),
              // });

              dispatch({
                type: "ADD_QUESTION",
                question: {
                  id: uuidv4(),
                  formId: form.formId,
                  type: "text",
                  label: "",
                  required: false,
                  order: form.questions.length,
                  options: [],
                },
              });
            }}
          >
            <IconPlus color="black" onClick={() => {}} /> <p>Add Question</p>
          </button>
        </div>

        {form.questions.length > 0 && (
          <div className="flex justify-center items-center py-4 gap-3 rounded-sm">
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="h-14 w-40 flex justify-center items-center  text-white bg-havelock-blue-700 rounded-4xl cursor-pointer"
                onClick={() => {
                  setSubmitLoader(true);

                  dispatch({
                    type: "SET_CREATOR",
                    createdById: session?.user.id,
                  });

                  submitFormData();
                  // console.log(form);
                }}
              >
                {isSubmitLoader ? (
                  <div className="flex flex-row justify-center gap-2 items-center">
                    <Whiteloader /> <p>loading...</p>
                  </div>
                ) : (
                  "submit"
                )}
              </button>
            </motion.div>

            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {form.questions.length > 0 && (
                <button
                  onClick={() => {
                    dispatch({ type: "RESET_FORM" });
                  }}
                  className="h-14 w-40 flex justify-center items-center  text-white bg-amber-600 rounded-4xl cursor-pointer"
                >
                  Delete
                </button>
              )}
            </motion.div>
          </div>
        )}
      </div>
      <div className="mt-5 p-10 w-full flex justify-center items-center h-16 bg-havelock-blue-600 text-white">
        <p>Some stuff here at the bottom</p>
      </div>
    </div>
  );
}
