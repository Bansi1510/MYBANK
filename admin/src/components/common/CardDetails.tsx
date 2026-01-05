import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleCard, type SingleCard } from "../services/card.api";

const CardDetails: React.FC = () => {
  const [card, setCard] = useState<SingleCard | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchCardDetails = async () => {
      const cardDetail = await getSingleCard(id);
      setCard(cardDetail);
    };

    fetchCardDetails();
  }, [id]);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading card details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-10 space-y-10">

        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Card Details
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Card ID: <span className="font-mono">{card.id}</span>
            </p>
          </div>

          <span
            className={`px-4 py-1.5 text-sm font-medium rounded-full
              ${card.status === "active"
                ? "bg-green-100 text-green-700"
                : card.status === "inactive"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {card.status}
          </span>
        </div>

        {/* Customer Info */}
        <Section title="Customer Information">
          <Item label="Customer Name" value={card.customer_name} />
          <Item label="Email Address" value={card.email} />
          <Item label="Customer ID" value={card.customer_id} />
          <Item label="Account Number" value={card.account_number} mono />
        </Section>

        {/* Card Info */}
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
            label="Expiry Date"
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
          <Item label="Issued At" value={formatDate(card.issued_at)} />
          <Item label="Activated At" value={formatDate(card.activated_at)} />
          <Item label="Blocked At" value={formatDate(card.blocked_at)} />
        </Section>

      </div>
    </div>
  );
};

/* ================= Helpers ================= */

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 bg-gray-50 rounded-lg p-6">
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
    <span className="text-base text-gray-600">
      {label}
    </span>
    <span
      className={`text-base font-medium text-gray-900 ${mono ? "font-mono tracking-wide" : ""
        }`}
    >
      {value || "-"}
    </span>
  </div>
);

const formatDate = (date?: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

export default CardDetails;
