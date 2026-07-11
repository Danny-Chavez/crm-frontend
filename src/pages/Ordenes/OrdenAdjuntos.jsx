import { useEffect, useState } from "react";
import { adjuntosService } from "../../services/adjuntos.service";
import { historialService } from "../../services/historial.service";

export default function OrdenAdjuntos({ ordenId }) {
  const [adjuntos, setAdjuntos] = useState([]);
  const [archivo, setArchivo] = useState(null);

  const cargarAdjuntos = async () => {
    try {
      const res = await adjuntosService.getByOrden(ordenId);
      setAdjuntos(res.data);
    } catch (err) {
      console.error("❌ Error cargando adjuntos:", err);
    }
  };

  useEffect(() => {
    cargarAdjuntos();
  }, [ordenId]);

  const subirArchivo = async () => {
    if (!archivo) return;

    try {
      await adjuntosService.upload(ordenId, archivo);

      // ⭐ Registrar historial
      await historialService.add(ordenId, {
        tipo: "adjunto",
        descripcion: `Archivo adjuntado: ${archivo.name}`,
        usuario: "Sistema",
        fecha: new Date().toISOString()
      });

      setArchivo(null);
      cargarAdjuntos();
    } catch (err) {
      console.error("❌ Error subiendo archivo:", err);
      alert("Error al subir archivo");
    }
  };

  const eliminarAdjunto = async (id) => {
    if (!confirm("¿Eliminar archivo adjunto?")) return;

    try {
      const adjunto = adjuntos.find((a) => a.id === id);

      await adjuntosService.delete(id);

      // ⭐ Registrar historial
      await historialService.add(ordenId, {
        tipo: "adjunto_eliminado",
        descripcion: `Archivo eliminado: ${adjunto?.nombre || "archivo"}`,
        usuario: "Sistema",
        fecha: new Date().toISOString()
      });

      cargarAdjuntos();
    } catch (err) {
      console.error("❌ Error eliminando adjunto:", err);
      alert("Error al eliminar adjunto");
    }
  };

  return (
    <div className="bg-surface p-5 rounded-xl shadow-md mt-6 font-sans">
      <h3 className="text-lg font-bold text-primary mb-4">
        Adjuntos
      </h3>

      {/* LISTA DE ADJUNTOS */}
      <ul className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto pr-2">
        {adjuntos.map((a) => (
          <li
            key={a.id}
            className="border border-border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
          >
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline hover:text-primary-dark transition"
            >
              {a.nombre}
            </a>

            <button
              onClick={() => eliminarAdjunto(a.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* SUBIR ARCHIVO */}
      <div className="flex gap-2 items-center">
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="border border-border p-3 rounded-lg w-full text-sm 
                     focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
        />

        <button
          onClick={subirArchivo}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition"
        >
          Subir
        </button>
      </div>

      {/* PREVISUALIZACIÓN DEL ARCHIVO */}
      {archivo && (
        <div className="mt-3 text-sm text-text-secondary">
          Archivo seleccionado: <strong>{archivo.name}</strong>
        </div>
      )}
    </div>
  );
}



