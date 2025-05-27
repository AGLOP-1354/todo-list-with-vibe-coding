import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Todo } from "../types/todo";
import { PriorityBadge } from "./todo/PrioritySelector";

interface TodoCardProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

const TodoCard: React.FC<TodoCardProps> = React.memo(({
  todo,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging: dndIsDragging } = useDraggable({
    id: todo.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== "completed";
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEdit();
    } else if (e.key === "Delete") {
      e.preventDefault();
      onDelete();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        todo-card relative bg-white rounded-lg shadow-sm border p-4 cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-md hover:scale-[1.02]
        ${dndIsDragging || isDragging ? "opacity-50 rotate-3 shadow-lg" : ""}
        ${isOverdue ? "border-red-300 bg-red-50 overdue-warning" : "border-gray-200"}
        ${getPriorityClass(todo.priority)}
      `}
      role="article"
      aria-label={`할 일: ${todo.title}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-medium text-gray-900 ${todo.status === "completed" ? "line-through text-gray-500" : ""}`}>
          {todo.title}
        </h4>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
            title="수정"
            aria-label={`${todo.title} 수정`}
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
            title="삭제"
            aria-label={`${todo.title} 삭제`}
          >
            🗑️
          </button>
        </div>
      </div>

      {todo.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {todo.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <PriorityBadge priority={todo.priority} />
        
        {todo.dueDate && (
          <div className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
            <span>📅</span>
            {new Date(todo.dueDate).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
            {isOverdue && <span className="text-red-500">⚠️</span>}
          </div>
        )}
      </div>

      {/* 드래그 인디케이터 */}
      <div className="absolute top-2 right-2 opacity-30 text-gray-400">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="2" cy="2" r="1" />
          <circle cx="6" cy="2" r="1" />
          <circle cx="10" cy="2" r="1" />
          <circle cx="2" cy="6" r="1" />
          <circle cx="6" cy="6" r="1" />
          <circle cx="10" cy="6" r="1" />
          <circle cx="2" cy="10" r="1" />
          <circle cx="6" cy="10" r="1" />
          <circle cx="10" cy="10" r="1" />
        </svg>
      </div>
    </div>
  );
});

TodoCard.displayName = "TodoCard";

export default TodoCard; 