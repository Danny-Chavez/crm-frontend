import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function useAuth() {
  const { user, setUser, login, logout, loading } = useContext(AuthContext);

  return { user, setUser, login, logout, loading };
}

