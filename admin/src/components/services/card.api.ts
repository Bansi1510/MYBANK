import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/card/",
  withCredentials:true
});

API.defaults.withCredentials=true;
export interface  CardRequest  {
  id: string;
  customer_id: number;
  account_number: string;
  card_type: string;
  card_brand: string;
  card_variant: string;
  request_status: string;
  requested_at: string;
};
export interface formData{
  account_number:string;
  card_type:string;
  card_brand:string;
  card_variant:string;
}
export const applyNewCardReq=async(formData:formData):Promise<boolean>=>{
  try {
    const res=await API.post("new-card-req",formData);
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  } catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
     const msg=axiosErr.response?.data.message||"can not apply card request ";
     toast.error(msg);
     return false;
  }
}

export const allCardReqs=async():Promise<CardRequest[]|[]>=>{
  try {
    const res=await API.get("get-new-card-reqs"); 
    if(res.data.status){
      return res.data.card_requests;
    }else{
      toast.error(res.data.message);
      return [];
    }

  } catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
     const msg=axiosErr.response?.data.message||"can not fetch requests";
     toast.error(msg);
     return  [];
  }
}
export const updateCardReqStatus=async(card_req_id:string,action:string):Promise<boolean>=>{
  try {
    const res=await API.patch("card-req/update-status",{card_req_id,action});
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  } catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
     const msg=axiosErr.response?.data.message||"can not fetch requests";
     toast.error(msg);
     return false;
  }
}