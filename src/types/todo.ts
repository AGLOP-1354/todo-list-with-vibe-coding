export type Priority = "high" | "medium" | "low";
export type TodoStatus = "todo" | "in-progress" | "completed";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: TodoStatus;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date | null;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date | null;
}

export interface TodoFilter {
  status: "all" | TodoStatus;
  priority: "all" | Priority;
  sortBy: "createdAt" | "priority" | "dueDate";
  sortOrder: "asc" | "desc";
} 