"use client";

import Image from "next/image";

import { signOut, useSession } from "next-auth/react";

export default function Logout() {
  const { status } = useSession();

  if (status == "loading") {
    return (
      <button className="cursor-pointer flex flex-row justify-center items-center gap-3 h-auto py-2.5 px-4 rounded-4xl text-white dark:text-white">
        loading...
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
      className="cursor-pointer flex flex-row justify-center items-center gap-3 h-auto py-2.5  rounded-4xl text-black dark:text-white"
    >
      <p className="text-white dark:text-white">Logout</p>
    </button>
  );
}
