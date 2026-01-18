import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';


const API = axios.create({
  baseURL: "http://localhost:1510/api/v1/transaction-anaytics/",
  withCredentials: true
})

API.defaults.withCredentials=true;

const getAllTransactionsAPI=async()=>{
  
}
