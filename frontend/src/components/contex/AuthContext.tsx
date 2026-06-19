import { createContext } from "react";

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  loading: true,
});