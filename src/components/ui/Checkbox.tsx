import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = "",
  ...props
}) => {
  const checkboxClasses = `
    w-4 h-4 text-blue-600 border-gray-300 rounded
    focus:ring-blue-500 focus:ring-2 transition-colors duration-200
    ${className}
  `;

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={checkboxClasses}
        {...props}
      />
      {label && (
        <label className="text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}; 