  import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { UserProfile } from "../redux/slices/authSlice";

const API=axios.create({
  baseURL:"http://localhost:1510/api/v1/user/",
  withCredentials:true
})

API.defaults.withCredentials=true;

 

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
