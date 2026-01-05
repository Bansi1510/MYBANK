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

export interface Card  {
  id: string;
  account_number: string;
  last4: string;
  status: "active" | "inactive" | "blocked";
  issued_at: string;
  expiry_month: number;
  expiry_year: number;
  customer_name: string;
};
export interface SingleCard {
  id: string;
  customer_id: number;
  customer_name: string;
  email: string;

  account_number: string;

  card_type: "debit" | "credit" | "virtual";
  card_brand: "visa" | "mastercard" | "rupay";
  card_variant: string;

  last4: string;
  expiry_month: number;
  expiry_year: number;

  status: "active" | "inactive" | "blocked";

  daily_limit: string;
  monthly_limit: string;
  used_daily: string;
  used_monthly: string;

  issued_at: string;
  activated_at: string | null;
  blocked_at: string | null;
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

export const allCards=async():Promise<Card[]|[]>=>{
  try {
    const res=await API.get("all-cards");
    if(res.data.status){
      return res.data.cards;
    }else{
      toast.error(res.data.message);
      return [];
    }
  } catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
     const msg=axiosErr.response?.data.message||"can not fetch  Cards ";
     toast.error(msg);
     return [];
  }
}

export const getSingleCard=async(id:string):Promise<SingleCard|null>=>{
  try {
    const res=await API.get(`card-details/${id}`);
    if(res.data.status){
      return res.data.card;
    }else{
      return null;
    }
  }  catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
     const msg=axiosErr.response?.data.message||"can not fetch  Cards ";
     toast.error(msg);
     return null;
  }
}

export const changeCardStatus=async(id:string,action:string):Promise<boolean>=>{
    try {
    const res=await API.patch("card-change-status",{id,action});
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  }  catch (error:unknown) {
    const axiosErr=error as AxiosError<{message?:string}>;
     const msg=axiosErr.response?.data.message||"can not fetch  Cards ";
     toast.error(msg);
     return  false;
  }
}