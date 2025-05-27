import React from "react";
import { Priority } from "../../types/todo";
import { Select } from "../ui/Select";

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  label?: string;
  className?: string;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
  label = "우선순위",
  className = "",
}) => {
  const priorityOptions = [
    { value: "high", label: "🔴 높음" },
    { value: "medium", label: "🟡 보통" },
    { value: "low", label: "🟢 낮음" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as Priority);
  };

  return (
    <Select
      label={label}
      value={value}
      onChange={handleChange}
      options={priorityOptions}
      className={className}
    />
  );
};

// 우선순위 배지 컴포넌트
interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = "",
}) => {
  const priorityConfig = {
    high: { color: "bg-red-100 text-red-800", icon: "🔴", label: "높음" },
    medium: { color: "bg-yellow-100 text-yellow-800", icon: "🟡", label: "보통" },
    low: { color: "bg-green-100 text-green-800", icon: "🟢", label: "낮음" },
  };

  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}; 