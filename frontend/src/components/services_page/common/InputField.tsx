// src/components/Services/common/InputField.tsx
import React from "react";

interface Props {
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<Props> = ({ label, value, type = "text", onChange, placeholder }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
};

export default InputField;
