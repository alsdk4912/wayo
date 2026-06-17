import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "../types/auth";
import { authenticate } from "../data/users";

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "wayo_auth_user";

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = useCallback((email: string, password: string) => {
    const found = authenticate(email, password);
    if (!found) return false;
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getRoleHome(role: AuthUser["role"]) {
  switch (role) {
    case "parent": return "/parent";
    case "tutor": return "/tutor";
    case "admin": return "/admin";
  }
}
