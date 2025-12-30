import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/loan/",
  withCredentials:true
})

API.defaults.withCredentials=true;

export interface AllLoanRequest {
  userName: string;
  mobileNumber: string;
  aadharCardNumber: string;
  panNumber: string | null;
  accountNumber: string;
  accountType: string;
  balance: string;
  loanType: string;
  status: string;
  loan_id:string
}
type DocumentItem = {
  url: string;
  file_type: "image" | "pdf";
};

export interface LoanData{
  loan_id: string;
  loan_type: string;
  loan_amount: string;
  tenure: number;
  loan_status: string;
  loan_created_at: string;

  user_name: string;
  email: string;
  mobile_number: string;

  account_number: string;
  account_type: string;
  balance: string;
  account_status: string;

  documents: Record<string, DocumentItem[]>;
};
export interface LoanEMIData {
  loan_id: number;
  policy_number: string;
  loan_type: string;
  original_loan_amount: number;
  remaining_principal: number;
  interest_rate: number;
  tenure: number;
  total_interest: number;
  total_payable: number;
  monthly_emi: number;
  total_paid: number;
  principal_paid: number;
  interest_paid: number;
  remaining_amount: number;
  paid_emis: string;
  remaining_tenure: number;
  status: string;
}
export interface LoanPayment {
  payment_id: string;
  policy_number: string;
  amount: string;
  principal_component: string;
  interest_component: string;
  remaining_balance: string;
  payment_date: string;
  payment_method: string;
}

export interface loanPaymentResposnes{
  paid_amount:number,
  remaining_balance:number,
  payment_method:string
}
export const getLoanReqAPI=async():Promise<AllLoanRequest[]|[]>=>{
  try {
    const res=await API.get("new-loan-req");

    if(res.data.status){
      return res.data.data;
    }else{
      toast.error(res.data.message);
      return [];
    }
  } catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
    const msg=axiosErr.response?.data?.message || "get new loan request error";
    toast.error(msg);
    return [];
  }
}

export const getSingleLoanReqAPI=async(loanReqId:string):Promise<LoanData|null>=>{
  try {
    const res=await API.get(`new-loan-req/${loanReqId}`);
    if(res.data.status){
      return res.data.data;
    }else{
      toast.error(res.data.messsage);
      return null;
    }

  } catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
      const msg=axiosErr.response?.data?.message||"can not fetch Paricular loan";
      toast.error(msg);
      return null;
  }
}  

export const updateLoanReqStatus=async(loan_id:string,action:string,reject_reason?:string|null,interest_rate?:number):Promise<boolean>=>{
  try {
    const res=await API.patch(`update-loan-status/${loan_id}`,{action,reject_reason,interest_rate});
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }

  } catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
      const msg=axiosErr.response?.data?.message||"can not update loan status";
      toast.error(msg);
      return false;
  }
}

export const getLoanPaymentDetailsAPI = async (
  policyNumber: string
): Promise<{ loan: LoanEMIData; payments: LoanPayment[] } | null> => {
  try {
    const res = await API.get(`${policyNumber}/payment-detail`);

    if (res.data.status) {
      return {
        loan: res.data.data.loan_summary,
        payments: res.data.data.payments,
      };
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
      const msg=axiosErr.response?.data?.message||"can not update loan status";
      toast.error(msg);
      return null;
  }
};

export const payLoanEmiAPI=async(amount:number,payment_method:string,policy_number:string):Promise<loanPaymentResposnes|false>=>{
  try {
      const res=await API.post("payment",{amount,payment_method,policy_number});
      if(res.data.status){
        toast.success(res.data.message);
        return res.data.data;
      }else{
        toast.error(res.data.message);
        return false;
      }
  } catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
      const msg=axiosErr.response?.data.message||"Loan  Payment can not ";
      toast.error(msg);
      return false;
  }
}