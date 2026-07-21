"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  authLogin,
  authRegister,
  authLogout,
  authGetProfile,
  authRefreshToken,
  type AuthUser,
} from "./api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  isLoggedIn: boolean;
  role: string;
  isManager: boolean;
  isReseller: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "auth_tokens";

function getStoredTokens(): {
  access_token: string;
  refresh_token: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeTokens(access_token: string, refresh_token: string) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ access_token, refresh_token })
  );
}

function clearTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  const setAuth = useCallback((user: AuthUser, token: string) => {
    setState({ user, token, loading: false });
  }, []);

  const clearAuth = useCallback(() => {
    clearTokens();
    setState({ user: null, token: null, loading: false });
  }, []);

  const updateUser = useCallback((user: AuthUser) => {
    setState((s) => ({ ...s, user }));
  }, []);

  useEffect(() => {
    const stored = getStoredTokens();
    if (!stored) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    authGetProfile(stored.access_token)
      .then((user) => {
        setAuth(user, stored.access_token);
      })
      .catch(async () => {
        try {
          const refreshed = await authRefreshToken(stored.refresh_token);
          storeTokens(refreshed.access_token, refreshed.refresh_token);
          const user = await authGetProfile(refreshed.access_token);
          setAuth(user, refreshed.access_token);
        } catch {
          clearAuth();
        }
      });
  }, [setAuth, clearAuth]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      const result = await authLogin(email, password);
      storeTokens(result.access_token, result.refresh_token);
      setAuth(result.user, result.access_token);
      return result.user;
    },
    [setAuth]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      full_name: string;
      phone?: string;
    }) => {
      const result = await authRegister(data);
      storeTokens(result.access_token, result.refresh_token);
      setAuth(result.user, result.access_token);
    },
    [setAuth]
  );

  const logout = useCallback(async () => {
    if (state.token) {
      try {
        await authLogout(state.token);
      } catch {
        /* ignore */
      }
    }
    clearAuth();
  }, [state.token, clearAuth]);

  const role = state.user?.role ?? "customer";
  const ROLE_LEVEL: Record<string, number> = {
    customer: 0,
    reseller: 1,
    manager: 2,
    superadmin: 3,
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        isLoggedIn: !!state.user,
        role,
        isManager: (ROLE_LEVEL[role] ?? 0) >= 2,
        isReseller: (ROLE_LEVEL[role] ?? 0) >= 1,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
