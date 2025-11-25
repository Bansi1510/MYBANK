import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface Account {
  id: number;
  account_number: string;
  account_type: string;
  balance: string;
  status: string;
  created_at: string;
}

interface AccountState {
  account: Account | null;
}

const initialState: AccountState = {
  account: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<Account>) {
      state.account = action.payload;
    },

    updateBalance(state, action: PayloadAction<string>) {
      if (state.account) {
        state.account.balance = action.payload;
      }
    },

    clearAccount(state) {
      state.account = null;
    },
  },
});

export const { setAccount, updateBalance, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
