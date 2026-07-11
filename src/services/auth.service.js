import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_AUTH;

export const loginRequest = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const meRequest = async (token) => {
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


