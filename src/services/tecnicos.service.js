import api from "../utils/axios";

export const tecnicosService = {
  getAll: () => api.get("/tecnicos"),

  // ⭐ opcional: útil para dashboards o ver perfil técnico
  getById: (id) => api.get(`/tecnicos/${id}`),
};

