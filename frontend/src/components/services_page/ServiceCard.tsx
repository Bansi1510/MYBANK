import React from "react";
import type { IconType } from "react-icons";

interface Props {
  icon: IconType;
  title: string;
  description: string;
}
const ServiceCard: React.FC<Props> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">

      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon size={28} className="text-blue-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
