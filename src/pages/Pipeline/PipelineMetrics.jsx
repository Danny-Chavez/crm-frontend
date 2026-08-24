export default function PipelineMetrics({ filteredOps, totalMonto, stages }) {
  return (
    <div className="grid grid-cols-3 gap-4">

      {/* Oportunidades filtradas */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <p className="text-xs text-gray-500">Oportunidades filtradas</p>
        <p className="text-2xl font-bold text-gray-800">
          {filteredOps.length}
        </p>
      </div>

      {/* Monto total filtrado */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <p className="text-xs text-gray-500">Monto total filtrado</p>
        <p className="text-2xl font-bold text-gray-800">
          {totalMonto.toLocaleString("es-CL", {
            minimumFractionDigits: 0,
          })}
        </p>
      </div>

      {/* Etapas activas */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <p className="text-xs text-gray-500">Etapas activas</p>
        <p className="text-2xl font-bold text-gray-800">
          {stages.filter((s) => s.activo).length}
        </p>
      </div>

    </div>
  );
}
