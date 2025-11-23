// import Image from "next/image";

import Publishedforms from "@/components/forms/publishedForms";
import Landingpage from "@/components/main/landingpage";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-screen px-10 flex-col items-center justify-start bg-white dark:bg-black sm:items-start">
        <Landingpage />

        <Publishedforms />
      </main>
    </div>
  );
}
