"use client";

import Loading from "@/app/loading";
import { allForms } from "@/data-access/queries/getforms";
import { FormType } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Staffdashboard() {
  const { data: session, status } = useSession();
  const { theme } = useTheme();

  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    async function fetchForms() {
      const forms = await allForms();

      setForms(forms);
    }

    fetchForms();
  }, []);

  if (status == "loading") {
    return <Loading />;
  }

  return (
    <div className="px-5">
      <div className="w-full flex-row items-center pl-10">
        hey {session?.user?.email}
      </div>

      <div className="bg-havelock-blue-600 dark:bg-havelock-600 p-2 rounded-[5px] border-t-7 border-t-havelock-blue-700 mt-5">
        <Link
          href={"/staff/dashboard/createform"}
          className="underline underline-offset-4 h-25 flex justify-center items-center"
        >
          <p>create a form</p>
        </Link>
      </div>

      <div className="bg-[#f7f7f7] dark:bg-[#1d1d1d] p-2 rounded-[5px] border-t-7 border-t-[#1a73e8] mt-5">
        {forms.map((entry, idx) => {
          return (
            <div key={idx} className="min-h-20 flex flex-col gap-2">
              <h1 className="text-2xl font-medium">{entry.title}</h1>
              <p>{entry.description}</p>
              <button className="w-30 h-10 flex justify-center items-center bg-[#376fb8] text-white rounded-md mt-2">
                <Link href={`/forms/${entry.shareId}`}>Open</Link>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
