import React from "react";
import { useParams } from "react-router-dom";
import MoneyTransfer from "../services_page/banking/MoneyTransfer";
import UPIService from "../services_page/upi/UPIService";
import BankingService from "../services_page/banking/BankingService";
import InsurancePremium from "../services_page/utility/InsurancePremium";
import CheckBalance from "../services_page/banking/CheckBalance";



type TransactionType =
  | "transfer"
  | "upi"
  | "loan"
  | "insurance"
  | "balance";

const COMPONENT_MAP: Record<TransactionType, React.ReactNode> = {
  transfer: <MoneyTransfer />,
  upi: <UPIService />,
  loan: <BankingService />,
  insurance: <InsurancePremium />,
  balance: <CheckBalance />
};

const TransactionScreen: React.FC = () => {
  const { type } = useParams();
  const pageType = (type as TransactionType) || "transfer";
  const Component = COMPONENT_MAP[pageType] || <UPIService />;

  return <div className="min-h-screen p-4 bg-gray-100">{Component}</div>;
};

export default TransactionScreen;
