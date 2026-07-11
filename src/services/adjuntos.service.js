import api from "../utils/axios";

export const adjuntosService = {
  // SUBIR ARCHIVO
  upload: (ordenId, file) => {
    const formData = new FormData();
    formData.append("archivo", file); // ⭐ nombre correcto para multer

    return api.post(`/adjuntos/${ordenId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // OBTENER ADJUNTOS DE UNA OS
  getByOrden: (ordenId) => api.get(`/adjuntos/orden/${ordenId}`),

  // ELIMINAR ADJUNTO
  delete: (id) => api.delete(`/adjuntos/${id}`)
};




