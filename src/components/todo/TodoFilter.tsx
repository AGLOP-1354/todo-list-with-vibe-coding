import React from "react";
import { TodoFilter, Priority } from "../../types/todo";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface TodoFilterProps {
  filter: TodoFilter;
  onFilterChange: (filter: Partial<TodoFilter>) => void;
  totalCount: number;
  completedCount: number;
  todoCount?: number;
  inProgressCount?: number;
}

export const TodoFilterComponent: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
  totalCount,
  completedCount,
  todoCount = 0,
  inProgressCount = 0,
}) => {
  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "todo", label: "할 일" },
    { value: "in-progress", label: "진행 중" },
    { value: "completed", label: "완료" },
  ];

  const priorityOptions = [
    { value: "all", label: "모든 우선순위" },
    { value: "high", label: "🔴 높음" },
    { value: "medium", label: "🟡 보통" },
    { value: "low", label: "🟢 낮음" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "생성일" },
    { value: "priority", label: "우선순위" },
    { value: "dueDate", label: "마감일" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "내림차순" },
    { value: "asc", label: "오름차순" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* 통계 정보 */}
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">전체: {totalCount}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">할 일: {todoCount}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-yellow-600">진행 중: {inProgressCount}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">완료: {completedCount}</span>
          </div>
        </div>

        {/* 필터 컨트롤 */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* 상태 필터 */}
          <div className="flex space-x-2">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.status === option.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => onFilterChange({ status: option.value as any })}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* 우선순위 필터 */}
          <Select
            value={filter.priority || "all"}
            onChange={(e) =>
              onFilterChange({
                priority: e.target.value as any,
              })
            }
            options={priorityOptions}
            className="w-40"
          />

          {/* 정렬 */}
          <div className="flex space-x-2">
            <Select
              value={filter.sortBy}
              onChange={(e) =>
                onFilterChange({ sortBy: e.target.value as any })
              }
              options={sortOptions}
              className="w-32"
            />
            <Select
              value={filter.sortOrder}
              onChange={(e) =>
                onFilterChange({ sortOrder: e.target.value as any })
              }
              options={sortOrderOptions}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 