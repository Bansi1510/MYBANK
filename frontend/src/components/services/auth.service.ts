import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/auth/",
  withCredentials: true,
});

API.defaults.withCredentials = true;
export interface User {
  id: number;
  
}

export const Login_API = async (account_number: string, password: string): Promise<boolean> => {
  try {
    console.log(account_number, password);
    const res = await API.post("user/login", { account_number, password });
    if (res.data.status) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }

  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Login Error";
    toast.error(msg);
    return false;
  }
};

export const OtpSendAPI = async (account_number: string, mobile_number: string): Promise<boolean> => {
  try {
    const res = await API.post("user/send-otp", { account_number, mobile_number });
     if (res.data.status) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "OTP send Error";
    toast.error(msg);
    return false;
  }
}

export const VerifyOtpAPI = async (mobile_number: string, account_number: string,otp: string): Promise<number | null> => {
  try {
    const res = await API.post("user/verify-otp", { mobile_number, otp,account_number });

    if (res.data.status) {
      toast.success(res.data.message);
       return res.data.user_id;
     } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "OTP verify Error";
    toast.error(msg);
    return null
  }
}

export const LogoutAPI = async (): Promise<boolean> => {
  try {
    const res = await API.post("/logout", {}, { withCredentials: true });
    if (res.data.status) {
      toast.success(res.data.message);
      return true;
    } else {
      toast.error(res.data.message);
      return false;
    }
  } catch (error: unknown) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    const msg = axiosErr.response?.data?.message || "Logout error";
    toast.error(msg);
    return false;
  }
}