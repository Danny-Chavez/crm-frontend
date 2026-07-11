import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Mientras valida token
  if (loading) {
    return <div className="p-10 text-center">Validando sesión...</div>;
  }

  // 🔴 Si no hay usuario → redirigir
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🟢 Usuario válido → renderizar contenido
  return children;
}
