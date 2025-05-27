import React, { useState } from "react";
import { Todo } from "../../types/todo";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { PriorityBadge } from "./PrioritySelector";
// React 19 호환성을 위해 아이콘을 이모지로 대체

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      setIsDeleting(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error("삭제 실패:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isOverdue = todo.dueDate && todo.dueDate < new Date() && !todo.completed;

  return (
    <div
      className={`
        bg-white rounded-lg border shadow-sm p-4 transition-all duration-200
        hover:shadow-md
        ${todo.completed ? "opacity-75" : ""}
        ${isOverdue ? "border-red-300 bg-red-50" : "border-gray-200"}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={todo.completed}
            onChange={(e) => onToggleComplete(todo.id, e.target.checked)}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`
                text-lg font-medium truncate
                ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}
              `}
            >
              {todo.title}
            </h3>
            <div className="flex items-center space-x-2">
              <PriorityBadge priority={todo.priority} />
              {isOverdue && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <span className="mr-1">⏰</span>
                  지연됨
                </span>
              )}
            </div>
          </div>

          {todo.description && (
            <p
              className={`
                text-sm mb-3
                ${todo.completed ? "text-gray-400" : "text-gray-600"}
              `}
            >
              {todo.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="mr-1">📅</span>
                생성: {formatDate(todo.createdAt)}
              </span>
              {todo.dueDate && (
                <span
                  className={`flex items-center ${
                    isOverdue ? "text-red-600 font-medium" : ""
                  }`}
                >
                  <span className="mr-1">⏰</span>
                  마감: {formatDate(todo.dueDate)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo)}
                disabled={isDeleting}
              >
                ✏️
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                🗑️
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 