import { useEffect, useState } from "react";
import api from "../utils/axios";

export default function Timeline({ entidadTipo, entidadId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get(`/actividades/${entidadTipo}/${entidadId}`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error cargando timeline:", err));
  }, [entidadTipo, entidadId]);

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Actividad reciente</h2>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">No hay actividad registrada.</p>
      )}

      {items.map((a) => (
        <div key={a.id} className="border-l-4 border-primary pl-3">
          <p className="text-sm font-semibold">
            {a.tipo} · {new Date(a.fecha).toLocaleString("es-CL")}
          </p>
          <p className="text-sm text-gray-600">{a.comentario}</p>
          <p className="text-xs text-gray-400">Por {a.usuario}</p>
        </div>
      ))}
    </div>
  );
}
