import { useSortable } from "@dnd-kit/sortable";
import React from "react";

import { CSS } from "@dnd-kit/utilities";

export const Task = ({ id, title }: { id: number; title: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <div className="m-5">
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="shadow-sm h-20 w-120 mt-2 bg-white rounded-md flex justify-center items-center flex-row"
      >
        {id}. {title}
      </div>
    </div>
  );
};
