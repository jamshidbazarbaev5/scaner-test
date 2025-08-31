import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { refreshToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  bonus: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const checkTokenExpiration = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    try {
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
  }, [checkTokenExpiration]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        const accessToken = localStorage.getItem("accessToken");
        const refreshTokenValue = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshTokenValue || !storedUserData) {
          setIsLoading(false);
          navigate("/login", { replace: true });
          return;
        }

        if (!checkTokenExpiration()) {
          setIsLoading(false);
          return;
        }

        try {
          await refreshToken();
          setUser(JSON.parse(storedUserData));
        } catch (error) {
          console.error("Token refresh failed:", error);
          logout();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [logout, navigate, checkTokenExpiration]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      isLoading,
    }),
    [user, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
