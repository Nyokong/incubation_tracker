"use client";

import { Ring } from "ldrs/react";
// import { useTheme } from "next-themes";
import React from "react";

export default function Wloader() {
  return (
    <div>
      <Ring size={20} speed={1.5} bgOpacity={0.25} color="white" />
    </div>
  );
}
