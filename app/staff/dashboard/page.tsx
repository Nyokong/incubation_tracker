"use client";

import Loading from "@/app/loading";
import { Separator } from "@/components/ui/separator";
import {
  getDraftForms,
  getPublishedForms,
} from "@/data-access/queries/getforms";
import { FormType } from "@/types/next-auth";
import { IconDotsVertical, IconForms, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { puplishFormUpdate } from "@/data-access/mutations/submitforms";
import { useGlobalNotify } from "@/context/globalnotifcations";

export default function Staffdashboard() {
  const { data: session, status } = useSession();

  const [draftforms, setDraftForms] = useState<FormType[]>([]);
  const [publishedforms, setPublishedForms] = useState<FormType[]>([]);
  const [getFormsLoader, setFormsLoader] = useState(false);

  const [isGeneratingLink, setGenerateLink] = useState(false);
  const [progress, setProgress] = React.useState(0);

  const {
    setGlobalNotification,
    globalNotification,
    setGlobalsuccessMessage,
    setGlobalErrorMessage,
    globalErrorMessage,
  } = useGlobalNotify();

  useEffect(() => {
    setFormsLoader(true);
    async function fetchForms() {
      const dforms = await getDraftForms();
      const pforms = await getPublishedForms();

      if (dforms) {
        setFormsLoader(false);
        setDraftForms(dforms);
        setPublishedForms(pforms);
      }
    }

    fetchForms();
  }, []);

  React.useEffect(() => {
    if (isGeneratingLink && progress != 10) {
      const timer = setTimeout(() => {
        setProgress((prev) => prev + 1);

        if (progress == 10) {
          setGenerateLink(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const publishForm = async (id: string) => {
    setFormsLoader(true);
    const updated = await puplishFormUpdate(id);

    setGlobalNotification(true);
    if (updated.error) {
      setGlobalErrorMessage(updated.error);
      setFormsLoader(false);
    }

    if (updated.success) {
      setGlobalsuccessMessage("form is published");

      const dforms = await getDraftForms();
      const pforms = await getPublishedForms();

      if (dforms) {
        setFormsLoader(false);
        setDraftForms(dforms);
        setPublishedForms(pforms);
      }
    }
  };

  const generateLink = () => {
    setGenerateLink(true);

    // once done with something here
    if (progress == 10) {
      setGenerateLink(false);
    }
  };

  const dateFormart = (date: Date) => {
    // const day = new Date(date).getDate();
    // const mon = new Date(date).getMonth();
    // const year = new Date(date).getFullYear();

    const fulldate = date.toLocaleString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return fulldate;
    // return `${day}/${mon}/${year}` ;
  };

  if (status == "loading" || getFormsLoader) {
    return <Loading />;
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
    <div className="mt-4 h-full relative">
      {/* <div className="w-full flex-row items-center ">
        <div className="h-[100px] w-full bg-havelock-blue-50 dark:bg-woodsmoke-900 p-5 rounded-md">
          <h1 className="text-2xl font-medium">hey {session?.user?.name}</h1>
        </div>
      </div> */}

      {isGeneratingLink && (
        <div className="absolute bg-white dark:bg-woodsmoke-900 w-full h-full z-20 flex justify-center items-center">
          {progress}
          <Progress value={progress} className="w-50" />
        </div>
      )}

      <div className=" mt-5 w-full flex flex-col gap-5 md:px-10 mb-5">
        <div className="px-5 md:px-10">
          <h1 className="text-2xl md:text-4xl font-semibold">
            Create new Form
          </h1>
        </div>
        <div className="w-full flex justify-start items-center px-10">
          <Link
            href={"/staff/dashboard/createform"}
            className="bg-[#f9f9f9] dark:bg-woodsmoke-950 cursor-pointer hover:underline underline-offset-4 h-35 w-35 rounded-md py-3 px-8 flex justify-center items-center shadow-sm"
          >
            <IconPlus />
          </Link>
        </div>
      </div>

      <div className="bg-[#f0f0f0] dark:bg-woodsmoke-950 w-full h-full pb-10">
        {/* <div className="h-25 flex items-center">
          <h1 className="text-5xl px-20 sm:px-5 md:px-5 lg:px-25 text-woodsmoke-800 dark:text-white">
            The Team's Forms
          </h1>
        </div> */}

        <div className="px-20 sm:px-5 md:px-5 lg:px-20">
          <Separator className="my-5" />
        </div>

        <div className="flex flex-col gap-5">
          <div className="text-5xl px-20 sm:px-5 md:px-5 lg:px-25 text-woodsmoke-800 dark:text-white">
            <h1>Draft Forms</h1>
          </div>
          <div className=" py-5 rounded-[5px] mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-center justify-items-center items-center px-2 sm:px-2 md:px-2 lg:px-25">
            {draftforms.map((entry, idx) => {
              return (
                <div
                  key={idx}
                  className="relative shadow-md inset-shadow-sm min-h-70 min-w-80 md:min-w-60 max-w-100 md:max-w-70 flex flex-col justify-between gap-2 p-5 rounded-xl bg-white dark:bg-woodsmoke-900 "
                >
                  <div className="absolute -top-2 -left-2 z-10">
                    <p className="h-6 w-6 rounded-md bg-woodsmoke-800 text-white flex justify-center items-center">
                      {idx + 1}
                    </p>
                  </div>

                  <div>
                    <div className="min-h-40 flex flex-col gap-2">
                      <div className="min-h-15 max-h-20 flex justify-cecnter -center flex-col ">
                        <h1 className="text-2xl font-medium">{entry.title}</h1>
                        <p>{entry.description}</p>
                      </div>

                      <Link
                        href={`/forms/${entry.shareId}`}
                        className="cursor-pointer"
                      >
                        <div
                          className={`bg-[#f8f8f8] dark:bg-woodsmoke-800 h-25 w-full flex justify-center items-center rounded-xl`}
                        >
                          <IconForms size={40} className="opacity-25" />
                        </div>
                      </Link>

                      <div className="flex flex-col">
                        <p className="text-[10px]">made in:</p>
                        <p>{`${dateFormart(entry.createdAt!)}`}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="h-10 flex items-center">{entry.status}</p>
                    <div className="flex flex-row justify-end">
                      <Popover>
                        <PopoverTrigger>
                          <IconDotsVertical />
                        </PopoverTrigger>
                        <PopoverContent className="w-40">
                          <div className=" flex flex-col gap-3">
                            <p
                              onClick={() => {
                                publishForm(entry.id);
                              }}
                            >
                              publish
                            </p>
                            <p>delete</p>
                            <Separator />
                            <div className="w-full h-10 px-4 rounded-sm flex justify-center items-center bg-havelock-blue-600 text-white">
                              <p
                                onClick={() => {
                                  generateLink();
                                }}
                              >
                                generate link
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* <button className="w-full h-10 flex justify-center items-center bg-[#376fb8] text-white rounded-4xl mt-2">
                    <Link href={`/forms/${entry.shareId}`}>Open</Link>
                  </button> */}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-20 sm:px-5 md:px-5 lg:px-20">
            <Separator className="my-5" />
          </div>

          <div className="flex flex-col gap-5">
            <div className="text-5xl px-20 sm:px-5 md:px-5 lg:px-25 text-woodsmoke-800 dark:text-white">
              <h1>Published Forms</h1>
            </div>
            <div className="py-5 rounded-[5px] mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 justify-center justify-items-center items-center px-2 sm:px-2 md:px-2 lg:px-25">
              {publishedforms.map((entry, idx) => {
                return (
                  <div
                    key={idx}
                    className="relative shadow-md inset-shadow-sm min-h-70 min-w-80 md:min-w-60 max-w-100 md:max-w-70 flex flex-col justify-between gap-2 p-5 rounded-xl bg-white dark:bg-woodsmoke-900 "
                  >
                    <div className="absolute -top-2 -left-2 z-10">
                      <p className="h-6 w-6 rounded-md bg-woodsmoke-800 text-white flex justify-center items-center">
                        {idx + 1}
                      </p>
                    </div>

                    <div>
                      <div className="min-h-40 flex flex-col gap-2">
                        <div className="min-h-15 max-h-20 flex justify-cecnter -center flex-col ">
                          <h1 className="text-2xl font-medium">
                            {entry.title}
                          </h1>
                          <p>{entry.description}</p>
                        </div>

                        <Link
                          href={`/forms/${entry.shareId}`}
                          className="cursor-pointer"
                        >
                          <div className="bg-[#f8f8f8] dark:bg-woodsmoke-800 h-25 w-full flex justify-center items-center rounded-xl">
                            <IconForms size={40} className="opacity-25" />
                          </div>
                        </Link>

                        <div className="flex flex-col">
                          <p className="text-[10px]">made in:</p>
                          <p>{`${dateFormart(entry.createdAt!)}`}</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="h-10 flex items-center">{entry.status}</p>
                      <div className="flex flex-row justify-end">
                        <Popover>
                          <PopoverTrigger>
                            <IconDotsVertical />
                          </PopoverTrigger>
                          <PopoverContent className="w-40">
                            <div className=" flex flex-col gap-3">
                              <p
                                onClick={() => {
                                  publishForm(entry.id);
                                }}
                              >
                                publish
                              </p>
                              <p>delete</p>
                              <Separator />
                              <div className="w-full h-10 px-4 rounded-sm flex justify-center items-center bg-havelock-blue-600 text-white">
                                <p
                                  onClick={() => {
                                    generateLink();
                                  }}
                                >
                                  generate link
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {/* <button className="w-full h-10 flex justify-center items-center bg-[#376fb8] text-white rounded-4xl mt-2">
                    <Link href={`/forms/${entry.shareId}`}>Open</Link>
                  </button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
