import axios, { AxiosError } from "axios"
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/card/",
  withCredentials:true
})

API.defaults.withCredentials=true;
interface cardReqData{
  request_type: string;
    card_type: string;
    card_brand: string;
    card_variant: string;
    account_number: string;
}
export const applycardReq=async(cardData:cardReqData):Promise<boolean>=>{
  try {
    const res=await API.post("new-card-req",cardData)
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  } catch (error:unknown) {
 const axiosErr = error as AxiosError<{ message?: string }>;
    const msg=axiosErr.response?.data.message || "can not apply for the loan";
    toast.error(msg);
    return false;
   }
}

export interface MyCard  {
  account_number: string;
  card_type: string;
  card_brand: string;
  card_variant: string;
  last4: string;
  card_status: string;
  request_status: string | null;
};

export const getMyCardAPI=async():Promise<MyCard[]|[]>=>{
  try {
    const res=await API.get('my-card');
    console.log(res)
    if(res.data.status){
      console.log(res.data.data);
      return res.data.data;
    }else{
      toast.error(res.data.message);
      return []
    }
  } catch (error:unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg=axiosErr.response?.data.message || "can not apply for the loan";
    toast.error(msg);
    return [];
   }
}
