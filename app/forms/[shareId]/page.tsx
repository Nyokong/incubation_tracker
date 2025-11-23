"use client";

import Googlesignin from "@/components/header/google_login";
// import Viewtemplateform from "@/components/forms/viewtemplate";
import Blackloader from "@/components/loaders/blackloader";
import Wloader from "@/components/loaders/w-loader";
import Whiteloader from "@/components/loaders/whiteloader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGlobalNotify } from "@/context/globalnotifcations";
import { createResponse } from "@/data-access/mutations/responses";
import { getSharedForms } from "@/data-access/queries/getforms";
import { getResponses } from "@/data-access/queries/getresponses";
import {
  Answer,
  AnswersType,
  FormType,
  OptionsType,
  QuestionsAnswerType,
  QuestionsType,
  ResponseAnswerType,
} from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

import React, { use, useState, useEffect } from "react";

type ResponseType = {
  formId: string;
  questions: QuestionsAnswerType[];
};

type FormWithQuestions = {
  form: FormType;
  questionsArr: QuestionsType[];
};

type AnswersWithLabel = {
  questionId: string;
  value: string;
  label: string;
};

type ResponseWithAnswers = Response & { answers: Answer[] };

export default function FormPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const [form, setForm] = React.useState<FormWithQuestions>();
  const [isAnswer, setAnswers] = useState<AnswersType[]>([]);

  const [isGrouped, setGrouped] =
    useState<Record<string, ResponseAnswerType[]>>();

  const [groupedAnswers, setGroupedAnswers] = useState<ResponseAnswerType[]>(
    []
  );

  const shareID = use(params);
  const { data: session, status } = useSession();

  const [isResponse, setResponse] = useState<ResponseType>();
  const [isLoggedOff, setIsLoggedOff] = useState(false);
  const [isFormCheck, setIsFormChecked] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [isResponseCount, setResponseCount] = useState<number>(0);

  const [isEmail, setIsEmail] = useState("");

  const [isResponseLoading, setIsResLoading] = useState<boolean>(false);

  // const [isCheckboxSelected, setCheckboxSelected] = useState<
  //   { questionId: string; value: string }[]
  // >([]);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [totalPages, setTotalPages] = useState(0);

  const {
    setGlobalNotification,
    globalNotification,
    setGlobalsuccessMessage,
    setGlobalErrorMessage,
    globalErrorMessage,
  } = useGlobalNotify();

  const { theme } = useTheme();

  const [countdown, setCountdown] = React.useState(10);
  // wait 10 seconds count down then redirect to home page

  useEffect(() => {
    async function fetchForm() {
      setIsFormLoading(true);
      const data = await getSharedForms(shareID.shareId);

      if (data) {
        setForm(data);
        setIsFormChecked(true);
        setIsFormLoading(false);

        if (status == "unauthenticated") {
          console.log("use is not logged in");
        }

        setRowsPerPage(pageSize);

        setTotalPages(Math.ceil(data.questionsArr.length / rowsPerPage));
      }
    }

    fetchForm();
  }, []);

  useEffect(() => {
    if (status == "unauthenticated") {
      console.log(isLoggedOff, "buddy is logged off");
      setIsLoggedOff(true);
    }

    console.log(isLoggedOff);
  }, [status]);

  useEffect(() => {
    async function fetchResponses() {
      const responses = await getResponses(shareID.shareId);

      if (responses) {
        if (responses) {
          setResponseCount(responses.count);
        }
      }
    }

    fetchResponses();
  }, []);

  React.useEffect(() => {
    if (!isFormCheck) {
      const timer = setTimeout(async () => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        if (countdown === 0) {
          if (form?.questionsArr == undefined) {
            setIsFormLoading(true);
            const data = await getSharedForms(shareID.shareId);

            if (data) {
              setForm(data);
              setIsFormLoading(false);
            }
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getSlicedList = (form_data: FormWithQuestions) => {
    const paginatedData = form_data.questionsArr.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return paginatedData;
  };

  async function getResponsesFunction() {
    // set loader
    setIsResLoading(true);

    const responses = await getResponses(shareID.shareId);

    if (responses) {
      // flatten responses.data and extract answers, attaching submittedBy where available
      // const flattenedAnswers = (
      //   Object.values(responses.data) as any[]
      // ).flatMap((r: any) =>
      //   (r.answers as AnswersType[]).map((a) => ({
      //     ...a,
      //     submittedBy: r.submittedBy ?? "Anonymous",
      //   }))
      // );

      // setAnswers(flattenedAnswers);

      // ensure responses.data is an array before setting state to satisfy the typed state
      const grouped = Array.isArray(responses.data)
        ? (responses.data as ResponseAnswerType[])
        : [];

      setGroupedAnswers(grouped);
      setGrouped(responses.grouped);

      console.log(responses.grouped);

      setResponseCount(responses.count);

      // set loader responses false
      setIsResLoading(false);
      // console.log(isAnswer);
    }
  }

  if (status == "loading") {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        {/* {theme === "dark" ? <Whiteloader /> : <Blackloader />} */}
        <Whiteloader />
      </div>
    );
  }

  if (isFormLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        {theme == "dark" ? (
          <div>
            <Wloader /> <p>loading...</p>
          </div>
        ) : (
          <div>
            <Blackloader /> <p>loading...</p>
          </div>
        )}
      </div>
    );
  }

  if (form == undefined) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex justify-center gap-4 items-center flex-row">
          <Whiteloader /> <p>Form not found</p>
          <p>Trying again in</p> <p>{countdown} seconds</p>
        </div>
      </div>
    );
  }

  const handleChange = (
    questionId: string,
    value: string,
    formId: string,
    type: string
  ) => {
    setResponse((prev) => {
      // if prev is undefined (first run), initialize it
      const updated: ResponseType = prev ?? { formId, questions: [] };

      let questions = [...updated.questions];

      switch (type) {
        case "checkbox": {
          const exists = questions.some(
            (q) => q.questionId === questionId && q.value === value
          );

          if (exists) {
            // remove if already selected
            questions = questions.filter(
              (q) => !(q.questionId === questionId && q.value === value)
            );
          } else {
            // add if not selected
            questions.push({ questionId, value, type });
          }
          break;
        }

        case "radio":
        case "dropdown": {
          // only one value per questionId
          questions = questions.filter((q) => q.questionId !== questionId);
          questions.push({ questionId, value, type });
          break;
        }

        case "text":
        case "textarea": {
          const existingIndex = questions.findIndex(
            (q) => q.questionId === questionId
          );
          if (existingIndex !== -1) {
            questions[existingIndex] = { ...questions[existingIndex], value };
          } else {
            questions.push({ questionId, value, type });
          }
          break;
        }

        default: {
          // fallback: overwrite or add
          const existingIndex = questions.findIndex(
            (q) => q.questionId === questionId
          );
          if (existingIndex !== -1) {
            questions[existingIndex] = {
              ...questions[existingIndex],
              value,
              type,
            };
          } else {
            questions.push({ questionId, value, type });
          }
        }
      }

      return { ...updated, questions };
    });

    console.log(isResponse);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submissions

    const formE = e.currentTarget;
    const requiredInputs = formE.querySelectorAll("[required]");

    let allFilled = true;
    requiredInputs.forEach((input) => {
      if (
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement ||
        input instanceof HTMLSelectElement
      ) {
        if (!input.value.trim()) {
          allFilled = false;
          input.classList.add("error"); // optional: highlight empty fields
        } else {
          input.classList.remove("error");
        }
      }
    });

    if (!allFilled) {
      alert("Please fill all required fields.");
      return;
    }

    if (status == "unauthenticated") {
      setIsLoggedOff(true);
    } else {
      console.log(isResponse);
      const response = await createResponse({
        formId: form.form.id,
        submittedBy: session?.user.id,
        questions: isResponse?.questions!,
      });

      // console.log(response);

      // if (response.error == undefined) {
      //   return redirect(`submitted/${form.form.id}`);
      // }
    }

    // console.log(isResponse);
  };

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();

    setGlobalNotification(true);

    if (isEmail == "") {
      setGlobalErrorMessage("Email is empty");
    }

    // const emailres = await getGuestEmail(isEmail, form?.form.id);

    // if (emailres.error != null) {
    //   setGlobalErrorMessage(emailres.error);
    // }

    // setGlobalsuccessMessage("Thank you! we will be in touch");
  }

  function formatResponse(value: string) {
    const formmated = JSON.parse(value);

    return { type: formmated.type, value: formmated.value };
  }

  return (
    // <div className="p-5 flex flex-col justify-center items-center">
    //   <Viewtemplateform form={form.form} questionsArr={form.questionsArr} />
    // </div>
    <div className="relative flex justify-center flex-col items-center">
      {isLoggedOff && (
        <div className=" w-screen h-full flex flex-col justify-center items-center gap-2 bg-red-400 p-5">
          <div className="h-auto md:w-[500px] text-white">
            <p>You are not logged in</p>
            <p>Providing your emails helps with reaching out</p>
          </div>

          <div className="h-auto w-[340px] md:w-[500px] text-white bg-havelock-blue-700 px-5 rounded-4xl">
            <Googlesignin />
          </div>

          <div className="hidden">
            <p className="text-white">If you dont have a Google Account</p>
            <form
              onSubmit={handleEmail}
              className="flex gap-2 md:flex-row flex-col justify-center items-center md:w-[500px]"
            >
              <input
                name="email"
                type="email"
                onChange={(e) => setIsEmail(e.target.value)}
                placeholder="Enter your email here..."
                className="h-15 w-full bg-havelock-blue-100 dark:bg-woodsmoke-800 dark:text-white px-5 rounded-4xl shadow-sm shadow-woodsmoke-300 "
              />
              <button className="h-15 w-50 bg-havelock-blue-700 text-white my-2 rounded-4xl">
                yes please!
              </button>
            </form>
          </div>
        </div>
      )}

      <Tabs
        defaultValue="questions"
        className="w-screen flex justify-center items-center"
      >
        {(status == "authenticated" && session?.user.role == "staff") ||
          (session?.user.role == "admin" && (
            <div className="w-full flex justify-center bg-white dark:bg-woodsmoke-800 p-2">
              <TabsList className="flex flex-row gap-2">
                <TabsTrigger value="questions" className="w-40">
                  Questions
                </TabsTrigger>
                <TabsTrigger
                  value="responses"
                  className="relative w-40"
                  onClick={() => {
                    // get responses
                    getResponsesFunction();
                  }}
                >
                  <div className="absolute -top-4 -right-4 h-8 w-8 bg-havelock-blue-500 text-white rounded-4xl flex justify-center items-center">
                    {isResponseCount}
                  </div>
                  Responses
                </TabsTrigger>
              </TabsList>
            </div>
          ))}
        <TabsContent
          value="questions"
          className="w-full flex justify-center mt-2"
        >
          <form
            className="flex h-auto flex-col gap-3 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] 2xl:w-[50%] mb-10"
            onSubmit={handleSubmit}
          >
            {/* Render questions here */}
            <div className="border-t-8 border-t-[#1d4d8d] rounded-t-md rounded-b-sm bg-[#f4f4f4] dark:bg-woodsmoke-950 h-auto px-3 py-10 flex flex-col gap-4">
              <div className="text-5xl font-medium  ">{form.form.title}</div>
              <div className="flex h-5 items-center mb-3.5">
                {form.form.description}
              </div>
            </div>

            <div className="flex h-auto flex-col gap-3">
              {getSlicedList(form).map((entry, idx) => {
                return (
                  <div
                    key={idx}
                    className="min-h-22 bg-[#f4f4f4] dark:bg-woodsmoke-950 rounded-md py-3"
                  >
                    <div className="min-h-10 pt-2 flex items-center px-5">
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
                          required={entry.required!}
                          onBlur={(e) =>
                            handleChange(
                              entry.id,
                              e.target.value,
                              form.form.id,
                              entry.type
                            )
                          }
                          className="h-10 w-full text-black dark:text-white dark:bg-woodsmoke-950 border-b-4 rounded-none border-t-0 border-l-0 border-r-0 border-b-[#265185] focus:bg-[#e5eaec] transition duration-75 ease-in-out shadow-none hover:rounded-none hover:border-t-0 hover:border-l-0 hover:border-r-0 hover:border-b-[#1b4477] focus:border-t-0 focus:border-l-0 focus:border-r-0 focus:border-b-[#1b4477] focus:ring-0 focus:outline-none hover:ring-0"
                        />
                      )}
                    </div>

                    <div className="px-5 mb-5">
                      {entry.type == "textarea" && (
                        <textarea
                          name={`${entry.order}`}
                          placeholder={`${entry.label}`}
                          required={entry.required!}
                          onBlur={(e) =>
                            handleChange(
                              entry.id,
                              e.target.value,
                              form.form.id,
                              entry.type
                            )
                          }
                          className="min-h-20 w-full text-black dark:text-white dark:bg-woodsmoke-900 p-2 border-b-4 rounded-t-sm border-t border-l border-r focus:bg-[#e5eaec] dark:focus:bg-woodsmoke-900 transition duration-75 ease-in-out shadow-none hover:rounded-none hover:border-t hover:border-l hover:border-r hover:border-b-[#4b7cb8] focus:border-t focus:border-l focus:border-r focus:border-b-[#4b7cb8] focus:ring-0 focus:outline-none hover:ring-0"
                        />
                      )}
                    </div>

                    <div className="px-5 mb-5">
                      {entry.type == "radio" && (
                        <RadioGroup
                          required={entry.required!}
                          defaultValue={`${entry.options[0].value}`}
                        >
                          {entry.options.map(
                            (option: OptionsType, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3"
                              >
                                <RadioGroupItem
                                  value={`${option.value}`}
                                  id={`${option.id}`}
                                  onBlur={(e) =>
                                    handleChange(
                                      entry.id,
                                      e.target.value,
                                      form.form.id,
                                      entry.type
                                    )
                                  }
                                />
                                <Label htmlFor={`${option.id}`}>
                                  {option.label}
                                </Label>
                              </div>
                            )
                          )}
                        </RadioGroup>
                      )}
                    </div>

                    <div className="px-5 mb-5 ">
                      {entry.type == "checkbox" && (
                        <span>
                          {entry.options.map(
                            (option: OptionsType, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3"
                              >
                                <div className="flex flex-row items-center min-h-8 gap-2.5 ">
                                  <Checkbox
                                    id={`${option.id}`}
                                    onBlur={(e) =>
                                      handleChange(
                                        entry.id,
                                        option.label,
                                        form.form.id,
                                        entry.type
                                      )
                                    }
                                    // onCheckedChange={(e) => {
                                    //   if (e == true) {
                                    //     handleCheckBoxChange(
                                    //       option.id,
                                    //       form.form.id,
                                    //       option.label,
                                    //       e
                                    //     );
                                    //   }
                                    //   if (e == false) {
                                    //     handleCheckBoxChange(
                                    //       option.id,
                                    //       form.form.id,
                                    //       option.label,
                                    //       e
                                    //     );
                                    //   }
                                    //   // console.log(e);
                                    // }}
                                    // onChange={(e) => {
                                    //   console.log(option.label);
                                    // }}
                                    required={entry.required!}
                                    className="bg-[#d4d4d4] shadow-sm shadow-[#f3f3f3] dark:shadow-woodsmoke-900 inset-shadow-sm"
                                  />
                                  <Label htmlFor="terms">{option.label}</Label>
                                </div>
                              </div>
                            )
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        setCurrentPage((p) => Math.max(p - 1, 1));
                      }}
                      className="cursor-pointer"
                    />
                  </PaginationItem>

                  <div className="flex flex-row items-center gap-2">
                    {currentPage} :
                    <span className="flex flex-row py-1 px-2 gap-2 bg-havelock-blue-700 text-white rounded-md">
                      total {totalPages}
                    </span>
                  </div>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                      }}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            {currentPage == totalPages && (
              <div className="flex h-auto justify-center items-center gap-4 my-2">
                <Button
                  type="submit"
                  disabled={isLoggedOff}
                  className="csbtn bg-[#1e4d8a] h-20 w-62 text-white"
                >
                  Submit Form
                </Button>
              </div>
            )}
          </form>
        </TabsContent>
        <TabsContent
          value="responses"
          className="w-full flex justify-center mt-2"
        >
          <div className="flex h-auto flex-col gap-3 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] 2xl:w-[50%] mb-10">
            {/* {isAnswer?.map((entry, idx) => (
              <div
                key={idx}
                className="h-auto py-2 px-2 flex gap-2 bg-white dark:bg-woodsmoke-900"
              >
                {formatResponse(entry.value).type}{" "}
                {formatResponse(entry.value).value}
              </div>
            ))} */}

            {groupedAnswers.map((group, idx) => (
              <div
                key={idx}
                className="h-auto p-5 flex flex-col gap-2 bg-havelock-blue-50 dark:bg-woodsmoke-900"
              >
                {/* {group.submittedBy} */}
                {group.answers.map((answer, idx) => (
                  <div key={idx}>
                    {answer.label}
                    <div>
                      {formatResponse(answer.value).type}
                      {formatResponse(answer.value).value}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* {isGrouped &&
              Object.entries(isGrouped).map(([userKey, responses]) => (
                <div key={userKey}>
                  <h2>User: {userKey}</h2>
                  {responses.map((resp) => (
                    <div key={resp.id} style={{ marginBottom: "1rem" }}>
                      <p>
                        <strong>Response ID:</strong> {resp.id}
                      </p>
                      <p>
                        <strong>Form ID:</strong> {resp.formId}
                      </p>
                      <p>
                        <strong>Submitted At:</strong>{" "}
                        {resp.submittedAt?.toString() ?? "N/A"}
                      </p>
                      <div className="bg-havelock-blue-50 p-5">
                        {resp.answers.map((a) => (
                          <li key={a.id}>
                            <strong>{a.label}</strong> → {a.value}{" "}
                            <em>
                              (QID: {a.questionId}, AID: {a.id})
                            </em>
                          </li>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))} */}

            <button
              className="hidden"
              onClick={() => {
                console.log(isAnswer);
              }}
            >
              get answers
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {/* { isGrouped && isGrouped[0].map} */}

      <div className="dark:text-white hidden">
        {isResponse?.questions.length! > 0 && (
          <div>
            {isResponse?.questions.map((res: QuestionsAnswerType, idx) => (
              <div key={idx}>
                {res.questionId} {res.type} {res.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
