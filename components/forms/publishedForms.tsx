"use client";

import { Separator } from "@/components/ui/separator";
import { getPublishedForms } from "@/data-access/queries/getforms";
import { FormType } from "@/types/next-auth";
import { IconForms } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import Loading from "@/app/loading";

export default function Publishedforms() {
  const [publishedforms, setPublishedForms] = useState<FormType[]>([]);
  const [getFormsLoader, setFormsLoader] = useState(false);

  useEffect(() => {
    setFormsLoader(true);
    async function fetchForms() {
      const pforms = await getPublishedForms();

      if (pforms) {
        setFormsLoader(false);
        setPublishedForms(pforms);
      }
    }

    fetchForms();
  }, []);

  const dateFormart = (date: Date) => {
    const fulldate = date.toLocaleString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return fulldate;
  };

  if (getFormsLoader) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="text-5xl px-20 sm:px-5 md:px-5 lg:px-25 text-woodsmoke-800 dark:text-white">
          <h1>Available Forms</h1>
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
                      <h1 className="text-2xl font-medium">{entry.title}</h1>
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
                  <div className="flex flex-row justify-end"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
