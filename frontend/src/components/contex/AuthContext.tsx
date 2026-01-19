import { createContext, useEffect, useState } from "react";
import api from "../services/axios.service";

interface AuthContextType {
  user: null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/refresh-token");
        api.defaults.headers.Authorization =
          `Bearer ${res.data.accessToken}`;
      } catch (err) {
        console.log(err);
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
