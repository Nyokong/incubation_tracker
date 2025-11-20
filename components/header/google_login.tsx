"use client";

import Image from "next/image";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Googlesignin() {
  const { status } = useSession();
  const [isGoogle, setIsGoogle] = useState(false);

  useEffect(() => {
    setIsGoogle(false);
  }, []);

  if (status == "loading" || isGoogle) {
    return (
      <button className="cursor-pointer flex flex-row justify-center items-center gap-3 h-auto py-2.5 px-4 rounded-4xl ">
        loading...
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        signIn("google");
        setIsGoogle(true);
      }}
      className="cursor-pointer flex flex-row justify-center items-center gap-3 h-auto py-2.5  "
    >
      <Image
        src={"/logos/icons8-google.svg"}
        width={18}
        height={18}
        alt={"google-logo-image"}
      />
      <p>Google Login</p>
    </button>
  );
}
