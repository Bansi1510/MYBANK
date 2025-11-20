import React from 'react';

interface Props {
  title: string;
  description: string;
}

const ServiceCard: React.FC<Props> = ({ title, description }) => (
  <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default ServiceCard;
