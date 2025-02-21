import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../supabaseClient";
import { LoginValues } from "../models/AuthModels";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null; // User type. supabase build-in typescript
  login: (loginData: LoginValues) => Promise<void>; // set Promise type so async function
  logout: () => Promise<void>;
  loading: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: false,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // Explicitly type the user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData?.session?.user ?? null);
      setIsAuthenticated(!!sessionData?.session?.user);
      setLoading(false);
    };
    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (loginData: LoginValues) => {
    setLoading(true); // Set loading to true during login
    try {
      const { data, error } = await supabase.auth.signInWithPassword(loginData);
      if (error) {
        console.error("Login failed:", error);
        throw error; // Throw the error to handle it in the calling component
      } else {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw the error for the caller to handle
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const logout = async () => {
    setLoading(true); // Set loading to true during logout
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
