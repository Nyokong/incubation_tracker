import { Ring } from "ldrs/react";
import { useTheme } from "next-themes";
import React from "react";

export default function Wloader() {
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
