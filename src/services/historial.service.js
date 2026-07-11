import api from "../utils/axios";

export const historialService = {
  // Obtener historial de una OS
  getByOrden: (id) => api.get(`/historial/${id}`),

  // Agregar evento al historial
  add: (id, data) => api.post(`/historial/${id}`, data),
};


