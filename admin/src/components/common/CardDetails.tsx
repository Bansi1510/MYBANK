import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleCard, type SingleCard, } from "../services/card.api";

const CardDetails: React.FC = () => {
  const [card, setCard] = useState<SingleCard | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchCardDetails = async () => {
      try {
        const cardDetail = await getSingleCard(id);
        setCard(cardDetail);
      } catch (error) {
        console.error("Failed to fetch card details", error);
      }
    };

    fetchCardDetails();
  }, [id]);

  if (!card) {
    return <p className="text-center text-gray-500">Loading card details...</p>;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Card Details
            </h1>
            <p className="text-sm text-gray-500">
              Card ID: {card.id}
            </p>
          </div>

          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
            {card.status}
          </span>
        </div>

        {/* Customer */}
        <Section title="Customer Information">
          <Item label="Name" value={card.customer_name} />
          <Item label="Email" value={card.email} />
          <Item label="Customer ID" value={card.customer_id} />
          <Item label="Account Number" value={card.account_number} mono />
        </Section>

        {/* Card */}
        <Section title="Card Information">
          <Item label="Card Type" value={card.card_type} />
          <Item label="Brand" value={card.card_brand} />
          <Item label="Variant" value={card.card_variant} />
          <Item
            label="Card Number"
            value={`**** **** **** ${card.last4}`}
            mono
          />
          <Item
            label="Expiry"
            value={`${card.expiry_month}/${card.expiry_year}`}
          />
        </Section>

        {/* Limits */}
        <Section title="Usage & Limits">
          <Item label="Daily Limit" value={`₹ ${card.daily_limit}`} />
          <Item label="Monthly Limit" value={`₹ ${card.monthly_limit}`} />
          <Item label="Used Today" value={`₹ ${card.used_daily}`} />
          <Item label="Used This Month" value={`₹ ${card.used_monthly}`} />
        </Section>

        {/* Timeline */}
        <Section title="Timeline">
          <Item label="Issued At" value={card.issued_at} />
          <Item label="Activated At" value={card.activated_at || ""} />
          <Item label="Blocked At" value={card.blocked_at || ""} />
        </Section>
      </div>
    </div>
  );
};

/* ===== Simple UI Helpers (same file) ===== */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="text-sm font-semibold text-gray-700 mb-3">
      {title}
    </h2>
    <div className="bg-gray-50 rounded-md p-4 space-y-3">
      {children}
    </div>
  </div>
);

const Item = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">
      {label}
    </span>
    <span
      className={`text-sm font-medium text-gray-800 ${mono ? "font-mono" : ""
        }`}
    >
      {value}
    </span>
  </div>
);

export default CardDetails;
