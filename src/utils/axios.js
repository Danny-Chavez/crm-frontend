import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // tu backend usa Authorization, no cookies
});

// ⭐ INYECTAR TOKEN ANTES DE CADA PETICIÓN
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");

    // asegurar que headers exista
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // DEBUG: mostrar qué URL y headers se van a enviar
    console.debug(
      "[API REQUEST]",
      config.method?.toUpperCase(),
      config.url,
      "Headers:",
      config.headers
    );
  } catch (e) {
    console.error("[API REQUEST ERROR]", e);
  }

  return config;
});

// ⭐ MANEJO GLOBAL DE ERRORES
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Sesión inválida o expirada");
      // NO borrar token
      // NO redirigir
      // NO hacer logout automático
    }
    return Promise.reject(err);
  }
);

export default api;



