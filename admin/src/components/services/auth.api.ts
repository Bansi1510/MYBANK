import axios, { AxiosError } from "axios";
import type { AdminStaff } from "../../redux/Slices/authSlice";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL:"http://localhost:1510/api/v1/auth/",
  withCredentials:true
})

API.defaults.withCredentials=true;

interface LoginData{
  email:string,
  password:string,
  role:string
}

export const Login_API=async(data:LoginData):Promise<AdminStaff|null>=>{
    try {
      if(data.role=='staff'){
        const res=await API.post("staff/login",data);
        if(res.data.status){
          toast.success(res.data.message);
          return res.data.staff;
        }else{
          toast.error(res.data.message);
          return null;
        }
      }else{
        const res=await API.post("admin/login",data);
         if(res.data.status){
          toast.success(res.data.message);
          return res.data.admin;
        }else{
          toast.error(res.data.message);
          return null;
        }
      }
    }  catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Login Error";
    toast.error(msg);
    return null
  }
}