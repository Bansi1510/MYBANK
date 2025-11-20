import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:1510/',
  withCredentials: true,
});

interface LoginData {
  email: string;
  password: string;
}
interface User {
  created_at: string;
  email: string;
  full_name: string;
  id: number;
  kyc_verified: boolean;
  phone: string;
  user_type: string;
}
interface ApiResponse {
  success: boolean;
  message: string;
  user: User;
  key: string ;
}

export const postLogin = async (userData: LoginData): Promise<ApiResponse | null> => {
  try {
    console.log("Hello")
    const res = await api.post<ApiResponse>('login', userData);
    console.log(res);
    if (res.data.success) {
      toast.success(res.data.message);
      return res.data;
    } else {
      toast.error(res.data.message);
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Login failed';
    toast.error(errorMessage);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const res = await api.get<ApiResponse>('/logout');
    if (res.data.success) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || 'Logout failed';
    toast.error(errorMessage);
    throw error;
  }
};
