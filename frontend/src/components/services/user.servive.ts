  import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { UserProfile } from "../redux/slices/authSlice";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/user/",
  withCredentials:true
})

API.defaults.withCredentials=true;
export interface AccountAPIModel {
  id: number;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
  created_at: string;
}
interface AccountAPIResponse {
  status: boolean;
  account: AccountAPIModel | null;
}
 

export const getProfileAPI=async():Promise<UserProfile|null>=>{
  try {
    const res=await API.get("profile");
    if(res.data.status){
      toast.success(res.data.message);
      return res.data.user;
    }else{
      toast.error(res.data.message);
      return null;
    }

  }catch (error: unknown) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      const msg = axiosErr.response?.data?.message || "fetch profile Error";
      toast.error(msg);
      return null
    }
}


export const fetchAccountDetailAPI = async (): Promise<AccountAPIModel | null> => {
  try {
    const res = await API.get<AccountAPIResponse>(`account`);
            console.log(res)

    if (res.data.status && res.data.account) {

      return res.data.account;
    }

    return null;
  } catch (error){ 
    console.log(error);
    return null;
  }
};