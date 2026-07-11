import api from "../utils/axios";

export const usuariosService = {
  getAll: () => api.get("/api/usuarios"),

  getById: (id) => api.get(`/api/usuarios/${id}`),

  create: (data) => api.post("/api/usuarios", data),

  update: (id, data) => api.put(`/api/usuarios/${id}`, data),

  delete: (id) => api.delete(`/api/usuarios/${id}`)
};
