"use client";

import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
// import { SortableItem } from "./SortableItem"; // custom component
import React, { useReducer, useState } from "react";
import { formReducer } from "../createform/formReducer";
import { Column } from "./columns";

type DataType = {
  id: number;
  value: string;
};

export default function TestPageStaff() {
  const [arrValues, setArrValue] = useState<DataType[]>([
    { id: 1, value: "blue" },
    { id: 2, value: "red" },
    { id: 3, value: "Green" },
    { id: 4, value: "Purple" },
    { id: 5, value: "Black" },
  ]);

  const [form, dispatch] = useReducer(formReducer, {
    title: "",
    description: "",
    questions: [], // ordered list
    status: "draft",
    updatedAt: 0,
    createdById: "",
    formId: `${uuidv4()}`,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const getArrPos = (id: number) => arrValues.findIndex((arr) => arr.id == id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id == over.id) return;

    setArrValue((prev) => {
      const originalPos = getArrPos(active.id);
      const newPos = getArrPos(over.id);

      return arrayMove(arrValues, originalPos, newPos);
    });
  };

  return (
    <div>
      {/* <QuestionList questions={form.questions} dispatch={dispatch} /> */}
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        {/* Components that use `useDraggable`, `useDroppable` */}

        <Column data={arrValues} />

        {/* <SortableContext
          items={arrValues.map((q) => q.value)}
          strategy={verticalListSortingStrategy}
        >
          <div className="w-120 flex flex-col gap-5 m-10">
            {arrValues.map((entry, idx) => (
              <div
                key={idx}
                {...useSortable({ id: idx }).attributes}
                className="h-18 w-100 bg-woodsmoke-600 text-white shadow-md flex justify-center items-center cursor-grab"
              >
                {entry.value}
              </div>
            ))}
          </div>
        </SortableContext> */}
      </DndContext>
    </div>
  );
}
