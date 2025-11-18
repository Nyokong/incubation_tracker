import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { Task } from "./task";

type DataType = {
  id: number;
  value: string;
};

export const Column = ({ data }: { data: DataType[] }) => {
  return (
    <div>
      <div>
        <SortableContext items={data} strategy={verticalListSortingStrategy}>
          {data.map((entry: DataType, idx: number) => (
            // <div key={idx}>{entry.value}</div>
            <Task id={entry.id} title={entry.value} key={idx} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
