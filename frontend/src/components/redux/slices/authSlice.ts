import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Account {
  id: number;
  account_number: string;
  account_type: string;
  balance: string;
  status: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;

  aadhar_number?: string;
  kyc_verified?: boolean;
  created_at?: string;

  accounts: Account[];
}

interface AuthState {
  userId: number | null;      
  profile: UserProfile | null; 
}

const initialState: AuthState = {
  userId: null,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<number>) {
      state.userId = action.payload;
    },
   setUserProfile(state, action: PayloadAction<UserProfile | null>) {
  state.profile = action.payload;
},

    clearAuth(state) {
      state.userId = null;
      state.profile = null;
    },
  },
});

export const { setUserId, setUserProfile, clearAuth } = authSlice.actions;
export default authSlice.reducer;
