"use client";

import React from "react";

import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <Ring size={20} speed={1.5} bgOpacity={0.25} color="black" />
    </div>
  );
}
