import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <div className="space-y-2 mb-6">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>

      {subtitle && (
        <p className="text-gray-600 max-w-2xl text-sm md:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
