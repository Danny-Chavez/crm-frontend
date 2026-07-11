import api from "../utils/axios";

export const usuariosService = {
  getAll: () => api.get("/usuarios"),

  getById: (id) => api.get(`/usuarios/${id}`),

  create: (data) => api.post("/usuarios", data),

  update: (id, data) => api.put(`/usuarios/${id}`, data),

  delete: (id) => api.delete(`/usuarios/${id}`)
};
