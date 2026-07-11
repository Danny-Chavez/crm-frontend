import api from "../utils/axios";

export const ordenesService = {
  // ============================
  // OS GLOBAL
  // ============================

  getAll: () => api.get("/api/ordenes"),

  getById: (id) => api.get(`/api/ordenes/${id}`),

  // ============================
  // CREAR OS
  // ============================
  create: async (data) => {
    try {
      const res = await api.post("/api/ordenes", data);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (create):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // UPDATE COMPLETO (PUT)
  // ============================
  update: async (id, data) => {
    try {
      const res = await api.put(`/api/ordenes/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (update):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // ELIMINAR OS
  // ============================
  remove: async (id) => {
    try {
      const res = await api.delete(`/api/ordenes/${id}`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (remove):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // OS por terminal
  // ============================
  getByTerminal: async (terminalId) => {
    try {
      const res = await api.get(`/api/ordenes/terminal/${terminalId}`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (getByTerminal):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // Cerrar OS
  // ============================
  cerrar: async (id) => {
    try {
      const res = await api.patch(`/api/ordenes/cerrar/${id}`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (cerrar):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // ⭐ NUEVO: CLONAR OS
  // ============================
  clonar: async (id) => {
    try {
      const res = await api.post(`/api/ordenes/${id}/clonar`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (clonar):", err.response?.data || err);
      throw err;
    }
  }
};






