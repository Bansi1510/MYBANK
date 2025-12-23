import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Account {
  id: number;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
 }

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  created_at?: string;
  accounts: Account[];
}

interface AuthState {
  isAuthenticated: boolean;
  profile: UserProfile | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
     setAuth(state, action: PayloadAction<UserProfile>) {
      state.isAuthenticated = true;
      state.profile = action.payload;
    },

     clearAuth(state) {
      state.isAuthenticated = false;
      state.profile = null;
    },

     updateAccountBalance(
      state,
      action: PayloadAction<{ accountId: number; newBalance: number }>
    ) {
      const account = state.profile?.accounts.find(
        (acc) => acc.id === action.payload.accountId
      );
      if (account) {
        account.balance = action.payload.newBalance;
      }
    },
  },
});

export const { setAuth, clearAuth, updateAccountBalance } = authSlice.actions;
export default authSlice.reducer;
