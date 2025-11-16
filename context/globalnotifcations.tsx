"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type GlobalNotifyContextType = {
  globalNotification: boolean;
  setGlobalNotification: (globalNotification: boolean) => void;
  globalErrorMessage: string;
  setGlobalErrorMessage: (globalErrorMessage: string) => void;
  globalSuccessMessage: string;
  setGlobalsuccessMessage: (globalSuccess: string) => void;
};

export const GlobalNotifyContext = createContext<GlobalNotifyContextType>({
  globalNotification: false,
  globalErrorMessage: "",
  globalSuccessMessage: "",
  setGlobalNotification: () => {},
  setGlobalErrorMessage: () => {},
  setGlobalsuccessMessage: () => {},
});

const GlobalNotifyContextProvider = ({ children }: { children: ReactNode }) => {
  const [globalNotify, setGlobalNotify] = useState<boolean>(false);
  const [ErrorMessage, setErrorMessage] = useState<string>("");
  const [SuccessMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (globalNotify) {
      timer = setTimeout(() => {
        setGlobalNotify(false);

        // clean up messages
        setGlobalErrorMessage("");
        setGlobalsuccessMessage("");
      }, 4000); // ✅ false after delay
    }

    return () => clearTimeout(timer);
  }, [globalNotify]);

  const setGlobalNotification = async (isNotify: boolean) => {
    const cached = localStorage.getItem("globalNotification");

    if (cached) {
      const data = JSON.parse(cached);

      if (data.globalNotify != isNotify) {
        setGlobalNotify(isNotify);
        localStorage.setItem(
          "globalNotification",
          JSON.stringify({ uxloading: isNotify })
        );
      } else {
        setGlobalNotify(data.globalNotify);
      }
    } else {
      setGlobalNotify(true);
      localStorage.setItem(
        "uxSettings",
        JSON.stringify({ globalNotify: isNotify })
      );
    }
  };

  const setGlobalErrorMessage = async (isError: string) => {
    if (ErrorMessage == "") {
      setErrorMessage(isError);
    } else {
      setErrorMessage("");
    }
  };

  const setGlobalsuccessMessage = async (isSuccess: string) => {
    if (SuccessMessage == "") {
      setSuccessMessage(isSuccess);
    } else {
      setSuccessMessage("");
    }
  };

  return (
    <GlobalNotifyContext.Provider
      value={{
        globalNotification: globalNotify,
        setGlobalNotification,
        globalErrorMessage: ErrorMessage,
        setGlobalErrorMessage,
        globalSuccessMessage: SuccessMessage,
        setGlobalsuccessMessage,
      }}
    >
      {children}
    </GlobalNotifyContext.Provider>
  );
};

export function useGlobalNotify() {
  const context = useContext(GlobalNotifyContext);

  if (context === undefined) {
    throw new Error(
      "GlobalNotifyContextProvider must be inside of GlobalNotifyContextProvider"
    );
  }

  return context;
}

export default GlobalNotifyContextProvider;
