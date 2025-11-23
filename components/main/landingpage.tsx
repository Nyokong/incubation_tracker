"use client";

import React from "react";
import { Button } from "@/components/ui/button";
// import { redirect } from "next/navigation";
// import { useSession } from "next-auth/react";

export default function Landingpage() {
  // const { data: session, status } = useSession();

  // if (status == "authenticated") {
  //   if (session.user.role == "admin" || session.user.role == "staff")
  //     return redirect("/staff/dashboard");
  // }

  return (
    <div className="mt-10 mb-10 px-2 sm:px-2 md:px-2 lg:px-25">
      <div className="text-5xl md:text-8xl">Govlead Forms</div>

      <div className="my-5">
        <Button className="csbtn">Get Started</Button>
      </div>
    </div>
  );
}
