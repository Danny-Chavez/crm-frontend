import api from "../utils/axios";

export const getComerciosByCliente = async (clienteId) => {
  const res = await api.get(`/comercios/cliente/${clienteId}`);
  return res.data;
};

export const createComercio = async (data) => {
  const res = await api.post("/comercios", data);
  return res.data;
};

export const updateComercio = async (id, data) => {
  const res = await api.put(`/comercios/${id}`, data);
  return res.data;
};

export const deleteComercio = async (id) => {
  const res = await api.delete(`/comercios/${id}`);
  return res.data;
};


