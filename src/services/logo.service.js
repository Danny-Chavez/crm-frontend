import api from "../utils/axios";

export const logoService = {
  get: () => api.get("/logo"),

  upload: (file) => {
    const formData = new FormData();
    formData.append("logo", file);
    return api.post("/logo/upload", formData);
  },
};

