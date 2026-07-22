import { useState } from "react";
import api from "../utils/axios";

export default function CrearRecordatorioModal({
  entidadTipo,
  entidadId,
  usuario,
  onClose,
  onCreated
}) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const crear = async () => {
    const payload = {
      entidad_tipo: entidadTipo,
      entidad_id: entidadId,
      titulo,
      descripcion,
      fecha_recordatorio: fecha,
      usuario
    };

    const res = await api.post("/recordatorios", payload);

    if (onCreated) onCreated(res.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">Crear Recordatorio</h2>

        <input
          type="text"
          placeholder="Título"
          className="w-full border p-2 rounded"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          className="w-full border p-2 rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={crear}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
