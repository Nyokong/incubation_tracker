"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Landingpage() {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    if (session.user.role == "admin" || session.user.role == "staff")
      return redirect("/staff/dashboard");
  }

  return (
    <div>
      <div>Hero Image</div>

      <div className="">
        <Button className="csbtn">Get Started</Button>
      </div>
    </div>
  );
}
