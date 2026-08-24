export default function PipelineModalHistorial({
  show,
  historial,
  historialOportunidad,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-4">
          Historial de movimientos — ID {historialOportunidad}
        </h2>

        {historial.length === 0 ? (
          <p className="text-sm text-gray-500">Sin movimientos registrados.</p>
        ) : (
          historial.map((h) => (
            <div
              key={h.id}
              className="border-b border-gray-200 py-2 text-sm"
            >
              {/* Etapas */}
              <p>
                <strong>{h.etapa_anterior_nombre || "—"}</strong> →{" "}
                <strong>{h.etapa_nueva_nombre || "—"}</strong>
              </p>

              {/* Fecha */}
              <p className="text-xs text-gray-500">
                {new Date(h.fecha_movimiento).toLocaleString("es-CL")}
              </p>

              {/* Usuario */}
              <p className="text-xs text-gray-600">
                Realizado por: {h.realizado_por}
              </p>

              {/* Motivo de pérdida */}
              {h.stage_nuevo === 10 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Motivo de pérdida:</strong>{" "}
                    {h.motivo_perdida || "No registrado"}
                  </p>

                  {h.comentario_perdida && (
                    <p className="text-sm text-red-600 mt-1">
                      <strong>Comentario:</strong> {h.comentario_perdida}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Cerrar
        </button>

      </div>
    </div>
  );
}
