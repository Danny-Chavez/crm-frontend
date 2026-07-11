import api from "../utils/axios";

export const getClientes = async () => {
  const res = await api.get("/api/clientes");
  return res.data;
};

export const createCliente = async (data) => {
  const res = await api.post("/api/clientes", data);
  return res.data;
};

export const updateCliente = async (id, data) => {
  const res = await api.put(`/api/clientes/${id}`, data);
  return res.data;
};

export const deleteCliente = async (id) => {
  const res = await api.delete(`/api/clientes/${id}`);
  return res.data;
};
