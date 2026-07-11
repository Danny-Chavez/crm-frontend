import api from "../utils/axios";

export const getComerciosByCliente = async (clienteId) => {
  const res = await api.get(`/api/comercios/cliente/${clienteId}`);
  return res.data;
};

export const createComercio = async (data) => {
  const res = await api.post("/api/comercios", data);
  return res.data;
};

export const updateComercio = async (id, data) => {
  const res = await api.put(`/api/comercios/${id}`, data);
  return res.data;
};

export const deleteComercio = async (id) => {
  const res = await api.delete(`/api/comercios/${id}`);
  return res.data;
};

