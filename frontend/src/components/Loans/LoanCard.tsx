import React from "react";
import type { IconType } from "react-icons";

interface LoanCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const LoanCard: React.FC<LoanCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-lg transition cursor-pointer">
      <div className="flex gap-4 items-start">
        <Icon className="text-blue-600 text-4xl" />
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
