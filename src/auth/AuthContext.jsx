import { createContext, useState, useEffect } from "react";
import api from "../utils/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay token al iniciar
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  }

  api.get("/auth/me")
    .then((res) => {
      setUser(res.data.usuario);
    })
    .catch((err) => {
      console.error("Error validando sesión:", err);
      // ⭐ NO BORRAR TOKEN
      // ⭐ NO HACER LOGOUT
      // ⭐ SOLO marcar que no hay usuario
      setUser(null);
    })
    .finally(() => setLoading(false));
}, []);


  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.access_token);

      // tu backend devuelve "usuario"
      setUser(res.data.usuario);

      return true;
    } catch (err) {
      console.error("Error login:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,   // ← NECESARIO
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}



