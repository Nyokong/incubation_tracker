"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useActionState, useContext } from "react";
import { loginAction } from "./loginaction";
import { Separator } from "@/components/ui/separator";
import Wloader from "@/components/loaders/w-loader";
// import { useTheme } from "next-themes";

export default function Loginpage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  if (state && "success" in state && state.success) {
    // window.location.href = "/";
  }

  return (
    <div className="flex h-[70vh] w-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center rounded-4xl py-10 h-auto sm:w-[400px] w-[320px]  bg-[#ffffff] dark:bg-[#333333] shadow-sm inset-shadow-sm inset-shadow-black-900">
        <form action={formAction} className="flex flex-col gap-2 ">
          <Label className="flex flex-row gap-2 justify-center h-[30px] m-2 text-black dark:text-[#ffffff]">
            Email
          </Label>
          <Input
            name="email"
            type="email"
            placeholder="enter your email"
            className="w-[250px] h-10 bg-blue-50 rounded-3xl inset-shadow-sm inset-shadow-black-900 dark:text-[#000000]"
          />

          <Label className="flex flex-row gap-2 justify-center h-[30px] m-2 text-black dark:text-[#ffffff]">
            Password
          </Label>
          <Input
            name="password"
            type="password"
            placeholder="enter your password"
            className="w-[250px] h-10 bg-blue-50 rounded-3xl inset-shadow-sm inset-shadow-black-900 dark:text-[#000000]"
          />

          <Separator color="blue" className="h-10" />

          <div className="flex justify-center mt-2">
            <Button
              type="submit"
              className="w-[200px] rounded-[50px] flex justify-center items-center text-white dark:text-[#ffffff] h-10 cursor-pointer shadow-md inset-shadow-xs inset-shadow-gray-400 bg-[#202020]"
            >
              {isPending ? (
                <div className="flex flex-row gap-2 text-white">
                  <Wloader />
                  loading...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
