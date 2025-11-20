"use client";

import Googlesignin from "@/components/header/google_login";
import { Separator } from "@/components/ui/separator";
import { useGlobalNotify } from "@/context/globalnotifcations";
import { getGuestEmail } from "@/data-access/mutations/guests";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function FormSubmitted({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { data: session, status } = useSession();

  const [isEmail, setIsEmail] = useState("");

  const {
    setGlobalNotification,
    setGlobalErrorMessage,
    setGlobalsuccessMessage,
  } = useGlobalNotify();

  useEffect(() => {
    // console.log('');
  }, []);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();

    setGlobalNotification(true);

    if (isEmail == "") {
      setGlobalErrorMessage("Email is empty");
    }

    const emailres = await getGuestEmail(isEmail, (await params).formId);

    if (emailres.error != null) {
      setGlobalErrorMessage(emailres.error);
    }

    setGlobalsuccessMessage("Thank you! we will be in touch");
  }

  return (
    <div className="h-screen px-5">
      <div className="w-full flex flex-col items-center justify-center py-10">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-4xl md:text-[80px] font-medium">Thank You</h1>
          <h4> for your response</h4>
        </div>

        {status != "unauthenticated" && (
          <div className="mt-5 bg-havelock-blue-50 dark:bg-woodsmoke-950 rounded-md shadow-sm p-4 flex flex-col justify-center md:w-150">
            <div>
              <p>we noticed you dont have an account with us</p>
              <h2 className="font-medium mt-10 text-2xl md:text-3xl">
                if you want us to reach out to you
              </h2>
              <Separator className="my-5" />
              <div className="flex justify-center flex-col gap-3 my-4">
                <p>Please provide us with your email </p>
                <form
                  onSubmit={handleEmail}
                  className="flex flex-col gap-5 justify-center items-center"
                >
                  <input
                    name="email"
                    type="email"
                    onChange={(e) => setIsEmail(e.target.value)}
                    placeholder="Enter your email here..."
                    className="h-15 w-full bg-havelock-blue-100 dark:bg-woodsmoke-800 dark:text-white px-5 rounded-md shadow-sm shadow-woodsmoke-300 "
                  />
                  <button className="h-15 w-50 bg-havelock-blue-700 text-white my-2 rounded-4xl">
                    yes please!
                  </button>
                </form>
              </div>

              <div className="relative w-full h-10 flex justify-center items-center my-5">
                <Separator />
                <div className="absolute left-[42%] md:left-[45%] top-0.5 text-2xl font-semibold bg-havelock-blue-50 dark:bg-woodsmoke-950 z-10 w-15 flex justify-center items-center ">
                  OR
                </div>
              </div>

              <div className="flex flex-col gap-4 bg-woodsmoke-700 p-3 rounded-2xl text-white">
                <p>create an account with us for Future communications!</p>
                <div className="bg-havelock-blue-800 text-white px-10 py-3 rounded-md mt-1 flex justify-center">
                  <Googlesignin />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
