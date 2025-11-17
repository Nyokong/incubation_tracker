"use client";

import { Ring, LineSpinner } from "ldrs/react";
import React from "react";

export default function Whiteloader() {
  return (
    <div>
      <LineSpinner size={20} speed={1.5} color="white" />
    </div>
  );
}
