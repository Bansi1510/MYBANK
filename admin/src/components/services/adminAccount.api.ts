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
export const changeAccountStatusAPI = async (req_no: number,action:string): Promise<boolean> => {
  try {
    const res = await API.put(`change-status/${req_no}`,{action});

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

export const newAccHisAPI=async():Promise<AccountHistory[]|[]>=>{
  try {
    const res=await API.get("new-acc-req-his");

    if(res.data.status){
      toast.success(res.data.message);
      return res.data.data;
    }else{
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