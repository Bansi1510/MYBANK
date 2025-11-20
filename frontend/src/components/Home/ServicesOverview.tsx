import React from 'react';
import ServiceCard from './ServiceCard';

const services = [
  { title: 'Accounts', description: 'Savings, Checking, and more.' },
  { title: 'Loans', description: 'Personal, Home, and Auto loans.' },
  { title: 'Investments', description: 'Grow your wealth securely.' },
  { title: 'Customer Support', description: '24/7 dedicated assistance.' },
];

const ServicesOverview: React.FC = () => (
  <section>
    <h2 className="text-3xl mt-15 font-bold text-gray-900 mb-12 text-center">Our Services</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      {services.map(({ title, description }) => (
        <ServiceCard key={title} title={title} description={description} />
      ))}
    </div>
  </section>
);

export default ServicesOverview;
