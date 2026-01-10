import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';


const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/staff/",
  withCredentials: true
})

API.defaults.withCredentials = true;
export interface formDataInterFace {
  name: string;
  email: string;
  mobile_number: number | "";
  address: string;
  aadhar_number: number | "";
  requested_account_type: string;
  pan_number: string;
  initial_deposit: number | "";
  kyc_document_type: string;
  kyc_document_url: string;
  created_by?: number;
}


export const newAccountReqAPI = async (formData: formDataInterFace): Promise<boolean> => {
  try {
    const res = await API.post("new-account", formData);

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
    return false
  }
}
export interface UserDetails {
  name: string;
  email: string;
  mobile_number: string;
  aadhar_number: string;
  account_number: string;
  account_type: string;
  balance: number;
}
export const getUserDetails = async (account_number: string, aadhar_number: string):Promise<UserDetails|null> => {
  try {
    const res=await API.get("get-user-detail",{params:{
      account_number,
      aadhar_number
    }})

    if(res.data.status){
      return res.data.user;
    }else{
      toast.error(res.data.message);
      return null;
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "User detils Error";
    toast.error(msg);
    return  null;
  }
}

export const updateUserDetails=async(data:UserDetails):Promise<boolean>=>{
  try {
    const res=await API.put("update-user-details",data);
    if(res.data.status){
      toast.success(res.data.message);
      return true;
    }else{
      toast.error(res.data.message);
      return false;
    }
  }  catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "User detils Error";
    toast.error(msg);
    return false;
  }
}