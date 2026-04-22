import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  name?: string;
  email?: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function loginWithJsonEndpoint(
  backendUrl: string,
  username: string,
  password: string,
) {
  const response = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("json-login-failed");
  }

  let token = "";
  let user: AuthUser = { name: username };

  try {
    const data = await response.json();

    if (typeof data === "string") {
      token = data;
    } else {
      token = data?.token ?? data?.accessToken ?? "";
      user = {
        name: data?.name ?? data?.user?.name ?? username,
        email: data?.email ?? data?.user?.email,
      };
    }
  } catch {
    token = "";
  }

  return { token, user };
}

async function loginWithSpringDefault(
  backendUrl: string,
  username: string,
  password: string,
) {
  const body = new URLSearchParams({ username, password });

  const response = await fetch(`${backendUrl}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("spring-login-failed");
  }

  return { token: "", user: { name: username } };
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [user, setUser] = useState<AuthUser>({});

  useEffect(() => {
    const previousFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await previousFetch(input, {
        ...init,
        credentials: init?.credentials ?? "include",
        headers: init?.headers,
      });

      if (response.status === 401 || response.status === 403) {
        setSessionAuthenticated(false);
        setUser({});
      }

      return response;
    };

    return () => {
      window.fetch = previousFetch;
    };
  }, []);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACK_URL;

    if (!backendUrl) {
      setIsCheckingSession(false);
      return;
    }

    fetch(`${backendUrl}/api/auth/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          setSessionAuthenticated(false);
          setUser({});
          return;
        }

        const data = await response.json();
        setSessionAuthenticated(true);
        setUser({
          name: data?.name,
          email: data?.email,
        });
      })
      .catch(() => {
        setSessionAuthenticated(false);
        setUser({});
      })
      .finally(() => {
        setIsCheckingSession(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    const backendUrl = import.meta.env.VITE_BACK_URL;

    if (!backendUrl) {
      throw new Error("Missing VITE_BACK_URL environment variable");
    }

    try {
      const jsonLogin = await loginWithJsonEndpoint(backendUrl, username, password);

      setSessionAuthenticated(true);
      setUser(jsonLogin.user);
      return;
    } catch {
      const springLogin = await loginWithSpringDefault(backendUrl, username, password);

      setSessionAuthenticated(true);
      setUser(springLogin.user);
    }
  };

  const logout = async () => {
    const backendUrl = import.meta.env.VITE_BACK_URL;

    if (backendUrl) {
      try {
        await fetch(`${backendUrl}/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch {
        // noop
      }
    }

    setSessionAuthenticated(false);
    setUser({});
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: sessionAuthenticated && !isCheckingSession,
      isLoading: isCheckingSession,
      user,
      login,
      logout,
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
