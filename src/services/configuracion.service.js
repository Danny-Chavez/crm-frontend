import api from "../utils/axios";

export const configuracionService = {
  getLogo: () => api.get("/configuracion/logo"),
  updateLogo: (base64) => api.put("/configuracion/logo", { base64 })
};


