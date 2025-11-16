"use client";

import Link from "next/link";
import React from "react";

export default function Unauthorized() {
  const [countdown, setCountdown] = React.useState(10);
  // wait 10 seconds count down then redirect to home page
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      if (countdown === 0) {
        window.location.href = "/";
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="h-[80vh] w-screen flex flex-col justify-center items-center p-10">
      <h1 className="font-bold text-4xl">Unauthorized</h1>
      <button className="h-10 w-30 rounded-4xl my-4  bg-[#4e4e4e] dark:bg-[#1f1f1f]">
        <Link href={"/"} className="underline underline-offset-3">
          Go Home
        </Link>
      </button>
      <div className="flex flex-row justify-center items-center gap-4">
        <p>You are about to be redirected in </p>
        <h4 className="text-3xl w-8 flex justify-center items-center">
          {countdown}
        </h4>
        <p>seconds</p>
      </div>
    </div>
  );
}
