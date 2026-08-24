// SIN useDraggable aquí
export default function PipelineCard({
  opportunity,
  onEdit,
  onViewOS,
  onHistorial,
  setActividadOportunidad,
  setShowActividadModal,
  onCustomer360,
  dragging = false, // usado solo por DragOverlay
}) {
  const monto = Number(opportunity.amount || opportunity.monto || 0);

  return (
    <div
      className={`
        bg-white p-3 rounded-xl border border-gray-100 mb-3 transition-all duration-300
        ${dragging
          ? "shadow-2xl scale-[1.03] pointer-events-none z-[9999]"   // ⭐ FIX REAL
          : "shadow-sm hover:shadow-lg"}
      `}
    >
      <div className="flex justify-between items-center mb-1">
        <p className="font-semibold text-gray-800">
          {opportunity.empresa || "Sin empresa"}
        </p>

        {opportunity.id && (
          <span className="text-xs text-gray-400">#{opportunity.id}</span>
        )}
      </div>

      <p className="text-sm text-gray-700">
        💰 {monto.toLocaleString("es-CL", { minimumFractionDigits: 0 })}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        👤 {opportunity.vendedor || "Sin responsable"}
      </p>

      {opportunity.os_id && (
        <div className="mt-2 flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
            OS #{opportunity.os_id}
          </span>

          <button
            onClick={() => onViewOS(opportunity.os_id)}
            className="text-blue-600 text-xs underline hover:text-blue-800"
          >
            Ver OS
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs">
        <button
          onClick={() => onHistorial(opportunity.id)}
          className="text-gray-600 hover:text-gray-800 hover:underline"
        >
          Ver historial
        </button>

        <button
          onClick={() => onEdit(opportunity)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Editar
        </button>

        <button
          onClick={() => {
            setActividadOportunidad(opportunity.id);
            setShowActividadModal(true);
          }}
          className="text-green-600 hover:text-green-800 hover:underline"
        >
          Registrar actividad
        </button>

        <button
          onClick={() => onCustomer360(opportunity.rut)}
          className="text-purple-600 hover:text-purple-800 hover:underline"
        >
          Ver cliente
        </button>
      </div>
    </div>
  );
}





