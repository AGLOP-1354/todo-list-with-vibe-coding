import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Todo, TodoStatus } from "../types/todo";
import { updateTodoStatus } from "../services/todoService";
import KanbanColumn from "./KanbanColumn";
import TodoCard from "./TodoCard";

interface KanbanBoardProps {
  todos: Todo[];
  onEditTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  onEditTodo,
  onDeleteTodo,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draggedTodo, setDraggedTodo] = React.useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns: { id: TodoStatus; title: string; color: string }[] = [
    { id: "todo", title: "할 일", color: "bg-blue-50 border-blue-200" },
    { id: "in-progress", title: "진행 중", color: "bg-yellow-50 border-yellow-200" },
    { id: "completed", title: "완료", color: "bg-green-50 border-green-200" },
  ];

  const getTodosByStatus = (status: TodoStatus) => {
    return todos.filter((todo) => todo.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const todo = todos.find((t) => t.id === active.id);
    setDraggedTodo(todo || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setDraggedTodo(null);
      return;
    }

    const todoId = active.id as string;
    const newStatus = over.id as TodoStatus;

    // 상태가 실제로 변경된 경우에만 업데이트
    const todo = todos.find((t) => t.id === todoId);
    if (todo && todo.status !== newStatus) {
      try {
        await updateTodoStatus(todoId, newStatus);
      } catch (error) {
        console.error("상태 변경 실패:", error);
      }
    }

    setActiveId(null);
    setDraggedTodo(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            todos={getTodosByStatus(column.id)}
            onEditTodo={onEditTodo}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && draggedTodo ? (
          <div className="rotate-3 opacity-90">
            <TodoCard
              todo={draggedTodo}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard; 