import api from "../utils/axios";

export const historialService = {
  // Obtener historial de una OS
  getByOrden: (id) => api.get(`/api/historial/${id}`),

  // Agregar evento al historial
  add: (id, data) => api.post(`/api/historial/${id}`, data),
};


