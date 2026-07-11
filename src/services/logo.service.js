import api from "../utils/axios";

export const logoService = {
  get: () => api.get("/api/logo"),

  upload: (file) => {
    const formData = new FormData();
    formData.append("logo", file);
    return api.post("/api/logo/upload", formData);
  },
};

