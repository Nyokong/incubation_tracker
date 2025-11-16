"use client";

import React from "react";

import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useTheme } from "next-themes";

export default function Loading() {
  const { theme } = useTheme();
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <Ring
        size={30}
        speed={1.5}
        bgOpacity={0.25}
        color={theme == "dark" ? "white" : "black"}
      />
    </div>
  );
}
