import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export interface UserData {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  bonus: string;
}

export interface User {
  user?: UserData;
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bonus?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);
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
      // Prevent multiple initializations
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        const accessToken = localStorage.getItem("accessToken");
        const storedUserData = localStorage.getItem("userData");

        // Set stored user data immediately if available
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUser(parsedUserData);
        }

        // If no token, redirect to login
        if (!accessToken) {
          setIsLoading(false);
          navigate("/login", { replace: true });
          return;
        }

        // Check token expiration
        if (!checkTokenExpiration()) {
          setIsLoading(false);
          return;
        }

        // Add authorization header to API
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        try {
          const response = await api.get('/user/me');
          const responseData = response.data;
          const userData = responseData.user || responseData;
          console.log('AuthContext - Fetched fresh user data:', userData);
          
          // If we have Telegram data, merge it
          if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            userData.first_name = userData.first_name || tgUser.first_name || '';
            userData.last_name = userData.last_name || tgUser.last_name || '';
            userData.username = userData.username || tgUser.username || '';
          }
          
          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // If we have stored user data, continue with that instead of logging out
          if (!storedUserData) {
            logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        if (!user) {
          logout();
        }
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
