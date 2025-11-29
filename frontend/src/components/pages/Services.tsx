import PageHeader from "../services_page/common/PageHeader";
import { mainServices } from "../services_page/data";
import ServiceCard from "../services_page/ServiceCard";
import Navbar from "../shared/Navbar";

const Services: React.FC = () => {
  return (
    <>
      <Navbar />

      <section className="w-full mt-16 bg-gray-50 min-h-screen p-6 md:p-10 space-y-10">

        <PageHeader
          title="Our Banking Services"
          subtitle="Explore our secure, modern, and easy-to-use financial services designed to support your banking needs with complete trust and convenience."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainServices.map((service) => (
            <ServiceCard
              key={service.key}
              icon={service.icon}
              title={service.title}
              description={service.description}
              path={service.path}
            />
          ))}
        </div>

      </section>
    </>
  );
};
export default Services;
