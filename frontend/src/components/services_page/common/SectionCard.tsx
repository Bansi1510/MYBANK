// src/components/Services/common/SectionCard.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
}

const SectionCard: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      {children}
    </div>
  );
};

export default SectionCard;
