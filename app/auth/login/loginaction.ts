"use server";
// app/actions/login.ts

import { signIn } from "@/auth"; // from next-auth

type LoginState = {
  error?: string;
  success?: boolean;
} | null;

export async function loginAction(
  _currentState: LoginState,
  formData: FormData
) {
  //   const email = formData.get("email") as string;
  //   const password = formData.get("password") as string;

  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Missing credentials" };
  }

  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      // callbackUrl: "/dashboard",
    });

    if (res?.error) {
      // window.location.href = "/"; // ✅ triggers middleware with fresh cookies
      return { error: res.error };
    }

    return { success: true };
  } catch (err) {
    return { error: `Unexpected error during sign-in.: ${err}` };
  }
}
