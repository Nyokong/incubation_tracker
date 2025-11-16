"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { redirect } from "next/navigation";

export default function Landingpage() {
  const { theme } = useTheme();

  return (
    <div>
      <div>Hero Image</div>

      <div className="">
        <Button className="csbtn">Get Started</Button>
      </div>
    </div>
  );
}
