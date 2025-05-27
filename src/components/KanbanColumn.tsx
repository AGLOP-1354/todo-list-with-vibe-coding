import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Todo, TodoStatus } from "../types/todo";
import TodoCard from "./TodoCard";

interface KanbanColumnProps {
  id: TodoStatus;
  title: string;
  color: string;
  todos: Todo[];
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  id,
  title,
  color,
  todos,
  onEditTodo,
  onDeleteTodo,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case "todo":
        return "📋";
      case "in-progress":
        return "⚡";
      case "completed":
        return "✅";
      default:
        return "📋";
    }
  };

  const getEmptyStateIcon = (status: TodoStatus) => {
    switch (status) {
      case "todo":
        return "🎯";
      case "in-progress":
        return "⚡";
      case "completed":
        return "🎉";
      default:
        return "🎯";
    }
  };

  const getEmptyStateMessage = (status: TodoStatus) => {
    switch (status) {
      case "todo":
        return "아직 할 일이 없어요";
      case "in-progress":
        return "아직 진행 중인 일이 없어요";
      case "completed":
        return "완료된 일이 없어요";
      default:
        return "아직 할 일이 없어요";
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        kanban-column min-h-[500px] rounded-lg border-2 border-dashed p-4 transition-all duration-200
        ${color}
        ${isOver ? "border-solid shadow-lg scale-105 drag-over" : ""}
      `}
      role="region"
      aria-label={`${title} 컬럼`}
      aria-describedby={`${id}-description`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2" id={`${id}-title`}>
          <span className="text-xl" aria-hidden="true">{getStatusIcon(id)}</span>
          {title}
        </h3>
        <span 
          className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600"
          aria-label={`${todos.length}개의 할 일`}
        >
          {todos.length}
        </span>
      </div>

      <div 
        className="space-y-3"
        id={`${id}-description`}
        aria-live="polite"
        aria-label={`${title} 할 일 목록`}
      >
        {todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onEdit={() => onEditTodo(todo)}
            onDelete={() => onDeleteTodo(todo.id)}
          />
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-400 transition-all duration-300 hover:text-gray-600">
            <div className="text-4xl mb-2 animate-bounce">{getEmptyStateIcon(id)}</div>
            <p className="font-medium">{getEmptyStateMessage(id)}</p>
            <p className="text-sm mt-1">드래그 앤 드롭으로 이동하세요</p>
          </div>
        )}
      </div>
    </div>
  );
});

KanbanColumn.displayName = "KanbanColumn";

export default KanbanColumn; 