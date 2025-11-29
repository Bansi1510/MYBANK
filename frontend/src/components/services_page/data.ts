// src/components/Services/data.ts
import type { IconType } from "react-icons";
import { FaMobileAlt, FaBolt, FaMoneyBillWave, FaHeartbeat } from "react-icons/fa";
import { MdAccountBalance } from "react-icons/md";

export interface ServiceItem {
  key: string;
  title: string;
  description: string;
  icon: IconType;
  path: string;
}

export const mainServices: ServiceItem[] = [
  {
    key: "upi",
    title: "UPI Services",
    description: "Send or receive money instantly using UPI.",
    icon: FaMobileAlt,
    path: "/services/upi",
  },
  {
    key: "banking",
    title: "Banking Services",
    description: "Check balance, transfer funds & manage accounts.",
    icon: MdAccountBalance,
    path: "/services/banking",
  },
  {
    key: "electricity",
    title: "Electricity Bill",
    description: "Pay your electricity bill securely.",
    icon: FaBolt,
    path: "/services/utility/electricity",
  },
  {
    key: "mobile-recharge",
    title: "Mobile Recharge",
    description: "Recharge prepaid SIMs instantly.",
    icon: FaMoneyBillWave,
    path: "/services/utility/mobile-recharge",
  },
  {
    key: "insurance",
    title: "Insurance Premium",
    description: "Pay insurance premium online.",
    icon: FaHeartbeat,
    path: "/services/utility/insurance",
  },
];
