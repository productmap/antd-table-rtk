import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const nodeRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};
