import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";


const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/account/",
  withCredentials: true
})

API.defaults.withCredentials = true;


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