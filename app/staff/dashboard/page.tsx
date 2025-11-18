"use client";

import Loading from "@/app/loading";
import { getAllForms } from "@/data-access/queries/getforms";
import { FormType } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Staffdashboard() {
  const { data: session, status } = useSession();

  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    async function fetchForms() {
      const forms = await getAllForms();

      setForms(forms);
    }

    fetchForms();
  }, []);

  if (status == "loading") {
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
    // if () {
    //   return redirect("/");
    // }
  }

  return (
    <div className="px-5 mt-4">
      <div className="w-full flex-row items-center ">
        <div className="h-[100px] w-full bg-havelock-blue-50 dark:bg-woodsmoke-900 p-5 rounded-md">
          <h1 className="text-2xl font-medium">hey {session?.user?.name}</h1>
        </div>
      </div>

      <div className="bg-havelock-blue-600 dark:bg-havelock-600 p-2 rounded-[5px] border-t-7 border-t-havelock-blue-700 mt-5">
        <Link
          href={"/staff/dashboard/createform"}
          className="underline underline-offset-4 h-25 flex justify-center items-center"
        >
          <p className="text-white">create a form</p>
        </Link>
      </div>

      <div className=" rounded-[5px] mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 justify-center justify-items-center items-center p-5">
        {forms.map((entry, idx) => {
          return (
            <div
              key={idx}
              className="min-h-20 flex flex-col gap-2 w-full md:w-[90%]  border-t-7 border-t-havelock-blue-600 rounded-t-md bg-white dark:bg-woodsmoke-800 p-4"
            >
              <h1 className="text-2xl font-medium">{entry.title}</h1>
              <p>{entry.description}</p>
              <button className="w-60 h-15 flex justify-center items-center bg-[#376fb8] text-white rounded-md mt-2">
                <Link href={`/forms/${entry.shareId}`}>Open</Link>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
