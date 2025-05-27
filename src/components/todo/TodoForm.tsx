import React, { useState } from "react";
import { TodoFormData, Priority } from "../../types/todo";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { PrioritySelector } from "./PrioritySelector";

interface TodoFormProps {
  onSubmit: (todoData: TodoFormData) => Promise<void>;
  initialData?: Partial<TodoFormData>;
  submitLabel?: string;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  submitLabel = "추가",
  onCancel,
}) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
    dueDate: initialData?.dueDate || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (formData.title.length > 100) {
      newErrors.title = "제목은 100자 이하로 입력해주세요.";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "설명은 500자 이하로 입력해주세요.";
    }

    if (formData.dueDate && formData.dueDate < new Date()) {
      newErrors.dueDate = "마감일은 현재 시간 이후로 설정해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // 폼 초기화 (추가 모드일 때만)
      if (!initialData) {
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: null,
        });
      }
    } catch (error) {
      console.error("폼 제출 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TodoFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setFormData((prev) => ({ ...prev, dueDate: date }));
    if (errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: "" }));
    }
  };

  const formatDateForInput = (date: Date | null | undefined): string => {
    if (!date) return "";
    return date.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="제목 *"
        value={formData.title}
        onChange={handleInputChange("title")}
        placeholder="할 일을 입력하세요"
        error={errors.title}
        disabled={isSubmitting}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          설명
        </label>
        <textarea
          value={formData.description}
          onChange={handleInputChange("description")}
          placeholder="상세 설명을 입력하세요 (선택사항)"
          rows={3}
          disabled={isSubmitting}
          className={`
            w-full px-3 py-2 border rounded-lg transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${errors.description ? "border-red-500" : "border-gray-300"}
          `}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <PrioritySelector
        value={formData.priority}
        onChange={handlePriorityChange}
      />

      <Input
        label="마감일"
        type="datetime-local"
        value={formatDateForInput(formData.dueDate)}
        onChange={handleDateChange}
        error={errors.dueDate}
        disabled={isSubmitting}
      />

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "처리 중..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
        )}
      </div>
    </form>
  );
}; 