import api from "../utils/axios";

export const estadosOSService = {
  getAll: () => api.get("/estados-os"),

  create: (data) =>
    api.post("/estados-os", {
      nombre: data.nombre,
      descripcion: data.descripcion,
      color: "#3b82f6",   // valor por defecto
      activo: true        // valor por defecto
    }),

  update: (id, data) =>
    api.put(`/estados-os/${id}`, {
      nombre: data.nombre,
      descripcion: data.descripcion,
      color: data.color || "#3b82f6",
      activo: data.activo ?? true
    }),

  remove: (id) => api.delete(`/estados-os/${id}`),
};


