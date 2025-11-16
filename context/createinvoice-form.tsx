"use client";

import { createContext, useContext, useState } from "react";

type FormInvoiceContextType = {
  isSelected: number;
  setIsSelected: (isSelecting: number) => void;
};

const FormInvoiceContext = createContext<FormInvoiceContextType | undefined>(
  undefined
);

export function FormInvoiceContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSelected, setIsSelected] = useState(-1);

  return (
    <FormInvoiceContext.Provider
      value={{
        isSelected,
        setIsSelected,
      }}
    >
      {children}
    </FormInvoiceContext.Provider>
  );
}

export function useFormInvoice() {
  const context = useContext(FormInvoiceContext);

  if (context === undefined) {
    throw new Error(
      "FormInvoiceContext must be inside of FormInvoiceContextProvider"
    );
  }

  return context;
}
