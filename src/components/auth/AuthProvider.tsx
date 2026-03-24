"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "@/lib/auth";

interface AuthContextValue {
  user: User | undefined;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  loading: true,
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? undefined);
      setLoading(false);
    });
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
