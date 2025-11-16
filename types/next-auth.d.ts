import { options } from "./../db/schema";
import { email } from "./../node_modules/zod/src/v4/core/regexes";
import NextAuth from "next-auth";

type UserRole = "admin" | "staff";

import NextAuth from "next-auth";
type UserData = {
  id: string;
  email: email;
  role?: string;
  firstname?: string | null;
  lastname?: string | null;
  image?: string | null;
};

declare module "@auth/core/types" {
  interface AdapterUser {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
    email: string;
    role?: string;
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    email: email;
    role?: string;
    firstname?: string | null;
    lastname?: string | null;
    image?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

type FormType = {
  id: string;
  title: string;
  description: string | null;
  createdBy: string;
  createdAt: Date | null;
  shareId: string | null;
};

export type FormDraftType = {
  formId: string;
  title: string;
  description: string;
  questions: Question[]; // ordered list
  status: "draft" | "published" | "archived";
  updatedAt: number;
  createdById: string;
};

type QuestionsType = {
  id: string;
  formId: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "dropdown";
  label: string;
  required: boolean | null;
  order: number;
  options: OptionsType[];
};

type OptionsType = {
  id: string;
  questionId: string;
  value: string;
  label: string;
};

type AdapterSession = {
  sessionToken: string;
  userId: string;
  expires: Date;
};
