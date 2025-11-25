import React from "react";
import type { IconType } from "react-icons";
import ServiceCard from "./ServiceCard";

interface ServiceItem {
  icon: IconType;
  title: string;
  description: string;
}

interface Props {
  services: ServiceItem[];
}
const ServiceList: React.FC<Props> = ({ services }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s, index) => (
        <ServiceCard
          key={index}
          icon={s.icon}
          title={s.title}
          description={s.description}
        />
      ))}
    </div>
  );
};

export default ServiceList;