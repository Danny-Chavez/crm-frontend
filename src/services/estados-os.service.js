import api from "../utils/axios";

export const estadosOSService = {
  getAll: () => api.get("/api/estados-os"),

  create: (data) =>
    api.post("/api/estados-os", {
      nombre: data.nombre,
      descripcion: data.descripcion,
      color: "#3b82f6",   // valor por defecto
      activo: true        // valor por defecto
    }),

  update: (id, data) =>
    api.put(`/api/estados-os/${id}`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      color: data.color || "#3b82f6",
      activo: data.activo ?? true
    }),

  remove: (id) => api.delete(`/api/estados-os/${id}`),
};

