"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

export type ThemeContextType = {
  currentTheme: string;
  toggleTheme: (newTheme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "light",
  toggleTheme: () => {},
});

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    const checkTheme = async () => {
      const cached = localStorage.getItem("theme");

      if (cached) {
        setTheme(cached);
      } else {
        setTheme("system");
        localStorage.setItem("theme", theme);
      }
    };

    checkTheme();
  }, []);

  const toggleTheme = async (newTheme: string) => {
    const cached = localStorage.getItem("theme");

    if (cached != newTheme) {
      setTheme(newTheme);

      localStorage.setItem("theme", newTheme);
    } else {
      setTheme(cached);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default CustomThemeProvider;
