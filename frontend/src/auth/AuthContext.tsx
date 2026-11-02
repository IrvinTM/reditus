import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  name?: string;
  email?: string;
  role?: string;
  mustChangePassword?: boolean;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "reditus-token";
const backendUrl: string = import.meta.env.VITE_BACK_URL;

function isBackendRequest(input: RequestInfo | URL) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  return Boolean(backendUrl) && url.startsWith(backendUrl);
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [user, setUser] = useState<AuthUser>({});

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setSessionAuthenticated(false);
    setUser({});
  };

  // every request to the backend carries the JWT
  useEffect(() => {
    const previousFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (!isBackendRequest(input)) {
        return previousFetch(input, init);
      }

      const headers = new Headers(init?.headers);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await previousFetch(input, { ...init, headers });

      if (response.status === 401) {
        clearSession();
      } else if (response.status === 403) {
        // a 403 is usually a missing role; only the password check needs handling here
        const body = await response.clone().json().catch(() => null);
        if (body?.error === "PASSWORD_CHANGE_REQUIRED") {
          setUser((previous) => ({ ...previous, mustChangePassword: true }));
        }
      }

      return response;
    };

    return () => {
      window.fetch = previousFetch;
    };
  }, []);

  useEffect(() => {
    if (!backendUrl || !localStorage.getItem(TOKEN_KEY)) {
      setIsCheckingSession(false);
      return;
    }

    fetch(`${backendUrl}/api/auth/me`)
      .then(async (response) => {
        const data = response.ok ? await response.json() : null;
        if (!data?.role) {
          clearSession();
          return;
        }
        setSessionAuthenticated(true);
        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          mustChangePassword: data.mustChangePassword,
        });
      })
      .catch(() => clearSession())
      .finally(() => {
        setIsCheckingSession(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    if (!backendUrl) {
      throw new Error("Missing VITE_BACK_URL environment variable");
    }

    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("login-failed");
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    setSessionAuthenticated(true);
    setUser({
      name: data.name ?? username,
      email: data.email,
      role: data.role,
      mustChangePassword: data.mustChangePassword,
    });
  };

  const logout = async () => {
    clearSession();
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${backendUrl}/api/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.error ?? "No se pudo cambiar la contraseña.");
    }
    setUser((previous) => ({ ...previous, mustChangePassword: false }));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: sessionAuthenticated && !isCheckingSession,
      isLoading: isCheckingSession,
      user,
      isAdmin: user.role === "ADMINISTRADOR",
      login,
      logout,
      changePassword,
    }),
    [isCheckingSession, sessionAuthenticated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
