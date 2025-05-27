import { useState, useEffect, useCallback } from "react";
import { Todo, TodoFormData, TodoFilter } from "../types/todo";
import {
  subscribeTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "../services/todoService";

interface UseTodosReturn {
  todos: Todo[];
  filteredTodos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  addNewTodo: (todoData: TodoFormData) => Promise<void>;
  updateExistingTodo: (todoId: string, updates: Partial<Todo>) => Promise<void>;
  removeExistingTodo: (todoId: string) => Promise<void>;
  toggleComplete: (todoId: string, completed: boolean) => Promise<void>;
  setFilter: (filter: Partial<TodoFilter>) => void;
  clearError: () => void;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilterState] = useState<TodoFilter>({
    status: "all",
    priority: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // 실시간 구독 설정
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeTodos((newTodos) => {
      setTodos(newTodos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 필터링된 할 일 목록
  const filteredTodos = useCallback(() => {
    let filtered = [...todos];

    // 상태별 필터링
    if (filter.status !== "all") {
      filtered = filtered.filter((todo) => todo.status === filter.status);
    }

    // 우선순위별 필터링
    if (filter.priority && filter.priority !== "all") {
      filtered = filtered.filter((todo) => todo.priority === filter.priority);
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filter.sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "dueDate":
          aValue = a.dueDate?.getTime() || 0;
          bValue = b.dueDate?.getTime() || 0;
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      return filter.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [todos, filter]);

  // 할 일 추가
  const addNewTodo = useCallback(async (todoData: TodoFormData) => {
    try {
      setError(null);
      await addTodo(todoData);
    } catch (err) {
      setError("할 일 추가에 실패했습니다.");
      throw err;
    }
  }, []);

  // 할 일 수정
  const updateExistingTodo = useCallback(
    async (todoId: string, updates: Partial<Todo>) => {
      try {
        setError(null);
        await updateTodo(todoId, updates);
      } catch (err) {
        setError("할 일 수정에 실패했습니다.");
        throw err;
      }
    },
    []
  );

  // 할 일 삭제
  const removeExistingTodo = useCallback(async (todoId: string) => {
    try {
      setError(null);
      await deleteTodo(todoId);
    } catch (err) {
      setError("할 일 삭제에 실패했습니다.");
      throw err;
    }
  }, []);

  // 완료 상태 토글
  const toggleComplete = useCallback(
    async (todoId: string, completed: boolean) => {
      try {
        setError(null);
        await toggleTodoComplete(todoId, completed);
      } catch (err) {
        setError("완료 상태 변경에 실패했습니다.");
        throw err;
      }
    },
    []
  );

  // 필터 설정
  const setFilter = useCallback((newFilter: Partial<TodoFilter>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  }, []);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    todos,
    filteredTodos: filteredTodos(),
    loading,
    error,
    filter,
    addNewTodo,
    updateExistingTodo,
    removeExistingTodo,
    toggleComplete,
    setFilter,
    clearError,
  };
}; 