import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";


const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/account/",
  withCredentials: true
})

API.defaults.withCredentials = true;

export interface AccountHistory {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  aadhar_number: string;
  requested_account_type: string;
  final_status: "approved" | "rejected";
  decided_by: number;
  decided_at: string;
};
export type AccountStatus = "active" | "closed" | "suspended";

export interface Account {
  name: string;
  mobile_number: string;
  aadhar_number: string;
  pan_number: string | null;
  account_number: string;
  account_type: "savings" | "current";
  status: AccountStatus;
}

export interface AccountDetails {
  account_id: number;
  account_number: string;
  account_type: string
  balance: string;
  status: string;
  account_created_at: string;
  user_id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  aadhar_number: string;
  pan_number: string | null;
  kyc_verified: boolean;
  kyc_method: string | null;
  kyc_document_url: string | null;
  user_created_at: string;
}

export interface PersonalDetails {
  user_id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  joined_on: string;
}

export interface AccountInfo {
  account_id: number;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
}

export interface Kyc {
  kyc_id: number;
  status: string;
  submitted_on: string;
}
export interface KycDocument {
  id: number;
  document_type: string;
  document_number: string;
}

export interface Loan {
  id: number;
  loan_type: string;
  amount: number;
}

export interface LoanPayment {
  id: number;
  loan_id: number;
  amount: number;
  paid_on: string;
}

export interface Card {
  id: number;
  card_type: string;
  card_number: string;
}



export interface Transaction {
  id: number;
  from_account: string;
  to_account: string;
  amount: number;
  transaction_type: string;
  created_at: string;
}

export interface UserProfile {
  personal_details: PersonalDetails;
  account: AccountInfo;
  kyc: Kyc | null;
  kyc_documents: KycDocument[];
  loans: Loan[];
  loan_payments: LoanPayment[];
  cards: Card[];
  transactions: Transaction[];
}

export const changeAccountStatusAPI = async (req_no: number, action: string): Promise<boolean> => {
  try {
    const res = await API.put(`change-status/${req_no}`, { action });

    if (res.data.status) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "New Account Error";
    toast.error(msg);
    return false;
  }
}

export const newAccHisAPI = async (): Promise<AccountHistory[] | []> => {
  try {
    const res = await API.get("new-acc-req-his");

    if (res.data.status) {
      toast.success(res.data.message);
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return [];
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "New Account Error";
    toast.error(msg);
    return [];
  }
}

export const getAccByStatus = async (status?: string): Promise<Account[] | []> => {
  try {
    const url = status ? `all-acc?status=${status}` : `all-acc`;

    const res = await API.get(url)
    if (res.data.status) {
      toast.success(res.data.message);
      return res.data.data;
    } else {
      toast.error(res.data.message);
      return [];
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "New Account Error";
    toast.error(msg);
    return [];
  }
}

export const getUserByAccNumber = async (accNumber: string): Promise<AccountDetails | null> => {
  try {
    const res = await API.get(`${accNumber}`);

    if (res.data.status) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Fetch Account Error";
    toast.error(msg);
    return null;
  }
}

export const updateAccountStatus = async (accountNumber: string, status: string): Promise<boolean> => {
  try {
    const res = await API.put(`${accountNumber}/status-update`, { status });
    if (res.data.status) {
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "can not update";
    toast.error(msg);
    return false;
  }
}
export const getFullUserProfile = async (account_number: string): Promise<UserProfile | null> => {
  try {
    const res = await API.get("user/all-details", { params: { account_number } });
    if (res.data.status) return res.data.data;
    toast.error(res.data.message);
    return null;
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Login Error";
    toast.error(msg);
    return null;
  }
}