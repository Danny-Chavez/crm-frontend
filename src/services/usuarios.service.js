import api from "../utils/axios";

export const usuariosService = {
  getAll: () => api.get("/usuarios"),

  getById: (id) => api.get(`/usuarios/${id}`),

  create: (data) => api.post("/usuarios", data),

  update: (id, data) => api.put(`/usuarios/${id}`, data),

  delete: (id) => api.delete(`/usuarios/${id}`),

  // ⭐ SuperAdmin cambia contraseña de cualquier usuario
  updatePassword: (id, nueva_password) =>
    api.put(`/usuarios/${id}/password`, { nueva_password }),

  // ⭐ Cada usuario cambia su propia contraseña desde su perfil
  updateMyPassword: (nueva_password) =>
    api.put(`/usuarios/me/password`, { nueva_password })
};


