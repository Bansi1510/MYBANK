import type { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
interface ServiceCardProps {
  title: string;
  description: string;
  icon: IconType;
  path?: string;
}


const ServiceCard = ({ title, description, icon: Icon, path }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 border rounded-xl cursor-pointer hover:shadow-lg"
      onClick={() => path && navigate(path)}
    >
      <Icon className="text-3xl mb-2" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
