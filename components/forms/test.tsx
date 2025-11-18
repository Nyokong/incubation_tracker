"use client";

import { useGlobalNotify } from "@/context/globalnotifcations";
// import getSharedForms, { getAllForms } from "@/data-access/queries/getforms";
// import { FormType, QuestionsType } from "@/types/next-auth";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

// type FormWithQuestions = {
//   form: FormType;
//   questionsArr: QuestionsType[];
// };

export default function Test() {
  //   const [isResponse, setResponse] = useState<ResponseType[]>([]);

  // const [form, setForm] = React.useState<FormWithQuestions>();
  // const [forms, setForms] = useState<FormType[]>([]);

  const { globalNotification } = useGlobalNotify();

  const notifRef = useRef<HTMLDivElement>(null);
  const [prevScroll, setPrevScroll] = useState<number | null>(null);

  useEffect(() => {
    if (globalNotification && notifRef.current) {
      // Save current scroll position
      setPrevScroll(window.scrollY);

      // Scroll to notification
      notifRef.current.scrollIntoView({ behavior: "smooth" });

      // Optionally scroll back after a delay
      const timer = setTimeout(() => {
        if (prevScroll !== null) {
          window.scrollTo({ top: prevScroll, behavior: "smooth" });
        }
      }, 3000); // 3s delay

      return () => clearTimeout(timer);
    }
  }, [globalNotification]);

  return (
    <div className="text-white">
      <div style={{ height: "1500px" }}>Lots of content here...</div>

      {/* Notification */}
      <AnimatePresence>
        {globalNotification && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "relative",
              margin: "20px auto",
              padding: "16px",
              background: "orange",
              borderRadius: "8px",
              width: "fit-content",
            }}
          >
            Global Notification!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
