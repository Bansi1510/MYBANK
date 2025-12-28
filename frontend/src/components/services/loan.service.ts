import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/loan/",
  withCredentials:true
})

API.defaults.withCredentials=true;

export interface LoanData{
  loan_id:number,
  loan_type:string,
  loan_amount:string,
  tenure:number,
  status:string,
  created_at:string
}
export const applyLoanAPI=async(formData:FormData):Promise<boolean>=>{
  try {
    const res=await API.post("apply-loan",formData);
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  }  catch (error: unknown) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || "Loan apply error";
      toast.error(msg);
      return false;
    }
}

export const getUserLoans=async():Promise<LoanData[]|LoanData|null>=>{

}