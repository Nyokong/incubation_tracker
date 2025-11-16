"use client";

import { createContext, useContext, useState } from "react";

type MenuContextType = {
  isOpen: boolean;
  setIsOpen: (isOpenning: boolean) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (context === undefined) {
    throw new Error("useMenuContext must be inside of MenuContextProvide");
  }

  return context;
}
