"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type UxContextType = {
  uxloading: boolean;
  toggleLoading: (uxloading: boolean) => void;
};

export const Uxcontext = createContext<UxContextType>({
  uxloading: false,
  toggleLoading: () => {},
});

const UxContextProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);

  //   useEffect(() => {
  //     const checkTheme = async () => {
  //       const cached = localStorage.getItem("theme");

  //       if (cached) {
  //         setTheme(cached);
  //       } else {
  //         setTheme("light");
  //         localStorage.setItem("theme", theme);
  //       }
  //     };

  //     checkTheme();
  //   }, []);

  const toggleLoading = async (isLoading: boolean) => {
    const cached = localStorage.getItem("uxSettings");

    if (cached) {
      const data = JSON.parse(cached);

      if (data.uxloading != isLoading) {
        setLoading(isLoading);
        localStorage.setItem(
          "uxSettings",
          JSON.stringify({ uxloading: isLoading })
        );
      } else {
        setLoading(data.uxloading);
      }
    } else {
      setLoading(true);
      localStorage.setItem(
        "uxSettings",
        JSON.stringify({ uxloading: isLoading })
      );
    }
  };

  return (
    <Uxcontext.Provider value={{ uxloading: loading, toggleLoading }}>
      {children}
    </Uxcontext.Provider>
  );
};

export function useUxContext() {
  const context = useContext(Uxcontext);

  if (context === undefined) {
    throw new Error("UxContextProvider must be inside of UxContextProvider");
  }

  return context;
}

export default UxContextProvider;
