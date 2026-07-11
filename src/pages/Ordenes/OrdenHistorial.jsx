import { useEffect, useState } from "react";
import { historialService } from "../../services/historial.service";

export default function OrdenHistorial({ ordenId }) {
  const [historial, setHistorial] = useState([]);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      const res = await historialService.getByOrden(ordenId);

      // Ordenar por fecha descendente
      const ordenado = res.data.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setHistorial(ordenado);
    };

    cargarHistorial();
  }, [ordenId]);

  const agregarComentario = async () => {
    if (!comentario.trim()) return;

    await historialService.add(ordenId, {
      tipo: "comentario",
      descripcion: comentario,
      usuario: "Sistema",           // ⭐ NUEVO
      fecha: new Date().toISOString() // ⭐ NUEVO
    });

    setComentario("");

    const res = await historialService.getByOrden(ordenId);

    const ordenado = res.data.sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );

    setHistorial(ordenado);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const badgeColor = (tipo) => {
    switch (tipo) {
      case "comentario":
        return "bg-blue-100 text-blue-700";
      case "cambio_estado":
        return "bg-green-100 text-green-700";
      case "cambio_tecnico":
        return "bg-purple-100 text-purple-700";
      case "cambio_prioridad":
        return "bg-orange-100 text-orange-700";
      case "creacion":
        return "bg-gray-200 text-gray-700";
      case "adjunto":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-surface p-5 rounded-xl shadow-md mt-6 font-sans">
      <h3 className="text-lg font-bold text-primary mb-4">
        Historial de Actividad
      </h3>

      {/* LISTA DE EVENTOS */}
      <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
        {historial.map((h) => (
          <li
            key={h.id}
            className="border border-border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            {/* TIPO */}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${badgeColor(
                h.tipo
              )}`}
            >
              {h.tipo}
            </span>

            {/* DESCRIPCIÓN */}
            <div className="text-sm text-text-main mt-2">
              {h.descripcion}
            </div>

            {/* USUARIO + FECHA */}
            <div className="text-xs text-text-secondary mt-2">
              {h.usuario || "Sistema"} — {formatFecha(h.fecha)}
            </div>
          </li>
        ))}
      </ul>

      {/* AGREGAR COMENTARIO */}
      <div className="mt-5 flex gap-2">
        <input
          className="border border-border p-3 rounded-lg w-full text-sm 
                     focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="Agregar comentario interno..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        <button
          onClick={agregarComentario}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}



