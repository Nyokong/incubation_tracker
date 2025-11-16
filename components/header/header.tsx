"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Googlesignin from "@/components/header/google_login";
import Logout from "./logout";

import {
  IconAlertTriangleFilled,
  IconDoor,
  IconGridDots,
  IconMoonFilled,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { LucideLightbulb } from "lucide-react";
import { useGlobalNotify } from "@/context/globalnotifcations";

import { motion } from "motion/react";
import Wloader from "../loaders/w-loader";
import Inloader from "../loaders/inloader";
// import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const [isLoginLoader, setLoginLoader] = useState(false);
  const [isLogOffLoader, setLogOffLoader] = useState(false);

  const {
    globalSuccessMessage,
    globalNotification,
    globalErrorMessage,
    setGlobalNotification,
  } = useGlobalNotify();

  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  // const pathname = usePathname();
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className=" flex flex-row justify-between items-center h-18 md:h-22 lg:h-26 bg-white dark:bg-woodsmoke-800 px-6 shadow-sm">
      {/* {theme == "dark" ? ( */}
      <Image
        suppressHydrationWarning
        src={
          theme === "dark"
            ? "/logos/parent_logoWTrans.png"
            : "/logos/parent_logo.png"
        }
        width={150}
        height={70}
        alt="header-logo-blue"
      />

      {globalNotification && (
        <motion.div
          initial={{ opacity: 0.2 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
          animate={{
            opacity: 1,
            transition: { duration: 0.25, ease: "easeIn" },
          }}
          className="fixed z-20 flex justify-center items-center w-full h-[200px] md:h-[100px] dark:bg-[#3636368f] text-white bg-[#f3f3f38f]"
        >
          {globalErrorMessage != "" && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center items-center flex-row w-[300px] gap-2.5 px-2.5 py-2.5 rounded-2xl shadow-sm dark:shadow-[#242424] h-auto bg-[#b14b4b] dark:bg-[#963f3f] dark:text-white"
            >
              <IconAlertTriangleFilled size={40} className="mx-4" />
              <p className="max-w-[180px] mx-[5px] flex justify-center items-center">
                {globalErrorMessage}
              </p>
              <button
                onClick={() => {
                  setGlobalNotification(false);
                }}
                className="  h-[30px] w-[30px]  cursor-pointer rounded-3xl hover:rotate-45 ease-in-out transition-transform duration-250 hover:bg-[#2e2e2e] flex justify-center items-center"
              >
                <IconX size={20} />
              </button>
            </motion.div>
          )}

          {globalSuccessMessage != "" && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="flex justify-center items-center flex-row w-[300px] gap-2.5 px-2.5 py-2.5 rounded-2xl shadow-sm dark:shadow-[#242424] h-auto bg-[#4bb14b] dark:bg-[#3f963f] dark:text-white"
            >
              <IconAlertTriangleFilled size={40} className="mx-4" />
              <p className="max-w-[180px] mx-[5px] flex justify-center items-center">
                {globalSuccessMessage}
              </p>
              <button
                onClick={() => {
                  setGlobalNotification(false);
                }}
                className="  h-[30px] w-[30px]  cursor-pointer rounded-3xl hover:rotate-45 ease-in-out transition-transform duration-250 hover:bg-[#2e2e2e] flex justify-center items-center"
              >
                <IconX size={20} />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="flex flex-row justify-center items-center gap-3">
        {!session?.user ? (
          <div className="flex flex-row justify-center items-center gap-3">
            <div className="md:flex flex-row items-center gap-2 hidden">
              <Googlesignin />
              <div className="h-6 w-[0.5px] bg-woodsmoke-700 hover:underline hover:underline-offset-2"></div>
              <Link
                href={"/auth/login"}
                className="flex mx-3"
                onClick={() => {
                  setLoginLoader(true);
                }}
              >
                {isLoginLoader ? (
                  <div className="flex flex-row justify-center items-center gap-2">
                    <Inloader /> <p>loading...</p>
                  </div>
                ) : (
                  "Login"
                )}
              </Link>
            </div>
            <button
              onClick={() => {
                setSideMenuOpen((prev) => !prev);
              }}
              className="h-10 w-10 rounded-full flex justify-center items-center csbtn"
            >
              {theme == "dark" ? (
                <IconGridDots color="white" />
              ) : (
                <IconGridDots color="black" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-center items-center gap-3">
            {session.user.role == "staff" ||
              (session.user.role == "admin" && (
                <Link href={"/staff/dashboard"}>dashboard</Link>
              ))}
            <button
              onClick={() => {
                setSideMenuOpen((prev) => !prev);
              }}
              className="h-10 w-10 rounded-full flex justify-center items-center csbtn"
            >
              {theme == "dark" ? (
                <IconGridDots color="white" />
              ) : (
                <IconGridDots color="black" />
              )}
            </button>
          </div>
        )}
      </div>

      {sideMenuOpen && (
        <div className="absolute z-30 right-0 top-0 h-full w-[300px] bg-[#181818] flex flex-col gap-4">
          <div className="w-full h-auto flex justify-start">
            <button
              onClick={() => {
                setSideMenuOpen((prev) => !prev);
              }}
              className="csbtn w-12 h-12 flex justify-center items-center "
            >
              <IconX color={`${theme == "dark" ? "white" : "white"}`} />
            </button>
          </div>

          {status == "unauthenticated" && (
            <div className="flex flex-col items-center gap-5 md:hidden w-full px-5">
              <Googlesignin />
              <Separator />
              <Link
                href={"/auth/login"}
                className="flex mx-3 text-white"
                onClick={() => {
                  setLoginLoader(true);
                }}
              >
                {isLoginLoader ? (
                  <div className="flex flex-row justify-center items-center gap-2">
                    <Inloader /> <p>loading...</p>
                  </div>
                ) : (
                  <div className="flex justify-start items-center h-10 w-full">
                    Login
                  </div>
                )}
              </Link>
            </div>
          )}

          <div className="px-5 flex flex-col gap-2">
            <button
              className={`csbtn ${
                theme == "dark" ? "text-white" : "text-white "
              } my-4`}
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              {theme == "dark" ? (
                <div className="flex flex-row justify-between items-center gap-3 ">
                  <p>lightmode</p>
                  <LucideLightbulb fill="white" size={17} />
                </div>
              ) : (
                <div className="flex flex-row justify-between items-center gap-3 ">
                  <p>darkmode</p>
                  <IconMoonFilled size={17} />
                </div>
              )}
            </button>
            <Separator />
            {status == "authenticated" && (
              <div
                className="csbtn "
                onClick={() => {
                  setLogOffLoader(true);
                }}
              >
                {isLogOffLoader ? (
                  <div className="flex flex-row justify-center items-center gap-2 h-10">
                    <Inloader /> <p>loading...</p>
                  </div>
                ) : (
                  <div className="flex flex-row justify-between items-center ">
                    <Logout /> <IconDoor color="white" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
