import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/transactions/",
  withCredentials:true
})

API.defaults.withCredentials=true;

export interface AcctoAcc{
    from_account: string;
    to_account: string;
    amount: number;
    description: string;
}

export const staffAcctoAccTransferAPI=async(payload:AcctoAcc):Promise<boolean>=>{
  try {
    const res=await API.post("/staff/transaction",payload);

    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  }catch (error:unknown) {
      const axiosErr=error as AxiosError<{message?:string}>;
       const msg=axiosErr.response?.data.message||"can not fetch  Cards ";
       toast.error(msg);
       return false;
  }
}