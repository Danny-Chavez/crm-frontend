import api from "../utils/axios";

export const ordenesService = {
  // ============================
  // OS GLOBAL (paginación + filtros)
  // ============================
  getAll: (page = 1, limit = 50, filtros = {}) =>
    api.get("/ordenes", {
      params: {
        page,
        limit,
        estado: filtros.estado,
        categoria: filtros.categoria,
        comercio: filtros.comercio,
        rut: filtros.rut
      }
    }),

  getById: (id) => api.get(`/ordenes/${id}`),

  // ============================
  // CREAR OS
  // ============================
  create: async (data) => {
    try {
      const res = await api.post("/ordenes", data);
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
      const res = await api.put(`/ordenes/${id}`, data);
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
      const res = await api.delete(`/ordenes/${id}`);
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
      const res = await api.get(`/ordenes/terminal/${terminalId}`);
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
      const res = await api.patch(`/ordenes/cerrar/${id}`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (cerrar):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // ⭐ REABRIR OS (SuperAdmin)
  // ============================
  reabrir: async (id) => {
    try {
      const res = await api.patch(`/ordenes/reabrir/${id}`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (reabrir):", err.response?.data || err);
      throw err;
    }
  },

  // ============================
  // ⭐ CLONAR OS
  // ============================
  clonar: async (id) => {
    try {
      const res = await api.post(`/ordenes/${id}/clonar`);
      return res.data;
    } catch (err) {
      console.error("❌ ERROR OS FRONT (clonar):", err.response?.data || err);
      throw err;
    }
  }
};









