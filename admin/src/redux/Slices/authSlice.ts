 import { createSlice, type PayloadAction } from "@reduxjs/toolkit"



export interface AdminStaff{
    id:number,
    name:string,
    email:string,
    role:string
}

interface AuthState{
  userData:AdminStaff|null
}
const initialState:AuthState={
  userData:null
}
const authSlice=createSlice({
  name:'auth',
  initialState,
  reducers:{
    setUserData:(state,action:PayloadAction<AdminStaff|null>)=>{
        state.userData=action.payload;
    },
    clearUser:(state)=>{
        state.userData=null;
    }
  }
})

export const {setUserData,clearUser}=authSlice.actions;

export default authSlice.reducer;