import api from "../utils/axios";

export const tecnicosService = {
  getAll: () => api.get("/api/tecnicos"),

  // ⭐ opcional: útil para dashboards o ver perfil técnico
  getById: (id) => api.get(`/api/tecnicos/${id}`),
};

