import React, { useState } from "react";
import { useTodos } from "../../hooks/useTodos";
import { Todo, TodoFormData } from "../../types/todo";
import { TodoItem } from "./TodoItem";
import { TodoFilterComponent } from "./TodoFilter";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { Button } from "../ui/Button";
// React 19 호환성을 위해 아이콘을 이모지로 대체

// 간단한 TodoForm 컴포넌트 (타입 에러 해결을 위해 임시로 여기에 정의)
const SimpleTodoForm: React.FC<{
  onSubmit: (data: TodoFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<TodoFormData>;
}> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState(initialData?.priority || "medium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: null,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="상세 설명 (선택사항)"
        rows={2}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as any)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">🟢 낮음</option>
        <option value="medium">🟡 보통</option>
        <option value="high">🔴 높음</option>
      </select>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          {initialData ? "수정" : "추가"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
};

export const TodoList: React.FC = () => {
  const {
    todos,
    filteredTodos,
    loading,
    error,
    filter,
    addNewTodo,
    updateExistingTodo,
    removeExistingTodo,
    toggleComplete,
    setFilter,
    clearError,
  } = useTodos();

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleAddTodo = async (todoData: TodoFormData) => {
    try {
      await addNewTodo(todoData);
      setShowForm(false);
    } catch (error) {
      console.error("할 일 추가 실패:", error);
    }
  };

  const handleEditTodo = async (todoData: TodoFormData) => {
    if (!editingTodo) return;

    try {
      await updateExistingTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    } catch (error) {
      console.error("할 일 수정 실패:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await removeExistingTodo(id);
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await toggleComplete(id, completed);
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-64">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">할 일 목록</h1>
        <p className="text-gray-600">효율적으로 할 일을 관리하세요</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError}>
              ❌
            </Button>
          </div>
        </div>
      )}

      {/* 할 일 추가 버튼 */}
      <div className="mb-6">
        {!showForm && !editingTodo && (
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
            <span className="mr-2">➕</span>
            새 할 일 추가
          </Button>
        )}
      </div>

      {/* 할 일 추가 폼 */}
      {showForm && (
        <div className="mb-6">
          <SimpleTodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* 할 일 수정 폼 */}
      {editingTodo && (
        <div className="mb-6">
          <SimpleTodoForm
            onSubmit={handleEditTodo}
            onCancel={() => setEditingTodo(null)}
            initialData={editingTodo}
          />
        </div>
      )}

      {/* 필터 */}
      <TodoFilterComponent
        filter={filter}
        onFilterChange={setFilter}
        totalCount={todos.length}
        completedCount={completedCount}
      />

      {/* 할 일 목록 */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">📝</div>
            <p className="text-gray-500">
              {todos.length === 0
                ? "아직 할 일이 없습니다. 새로운 할 일을 추가해보세요!"
                : "조건에 맞는 할 일이 없습니다."}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}; 