import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user_type: string;
  kyc_verified: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
 
}

const initialState: AuthState = {
  user: null,       
 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
     clearUser(state) {
      state.user = null;
    },
  }
})

export const Authactions = authSlice.actions;
export default authSlice.reducer;
