import { createContext, useState, ReactNode } from "react";

interface AuthType {
  token: string;
  department: string[];
}

interface AuthContextType {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthType>({
    token: "",
    department: [],
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
