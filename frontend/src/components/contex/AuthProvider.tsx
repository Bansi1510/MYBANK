import { useEffect, useState, type ReactNode } from "react";
import api from "../services/axios.service";
import { AuthContext, type User } from "./AuthContext";

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await api.post("/auth/refresh-token");

      const token = res.data?.accessToken;

      if (token) {
        api.defaults.headers.common.Authorization =
          `Bearer ${token}`;
      }

      setUser(res.data?.user || null);

      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    let intervalId: number;

    const init = async () => {
      await refreshSession();

      setLoading(false);

      intervalId = window.setInterval(async () => {
        const success = await refreshSession();

        if (!success) {
          clearInterval(intervalId);
        }
      }, 10 * 60 * 1000);
    };

    init();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;