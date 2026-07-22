import { useDroppable, useDraggable } from "@dnd-kit/core";
import OpportunityCard from "./PipelineCard";

// ⭐ Wrapper que maneja el drag correctamente SIN duplicidad
function DraggableWrapper({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition: "transform 0.2s ease",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}

export default function StageColumn({
  stage,
  opportunities,
  onEdit,
  onViewOS,
  onHistorial,
  setActividadOportunidad,
  setShowActividadModal,
  onCustomer360,
  activeId, // ⭐ viene desde Pipeline.jsx
}) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  const totalMonto = opportunities.reduce(
    (acc, o) => acc + Number(o.amount || o.monto || 0),
    0
  );

  const sortedOps = [...opportunities].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div
      ref={setNodeRef}
      className="w-80 bg-white rounded-xl border border-gray-100 shadow-lg/30 hover:shadow-xl transition-all duration-300 flex flex-col"
      style={{ borderTop: `4px solid ${stage.color || "#3b82f6"}` }}
    >
      <div className="sticky top-0 bg-white pt-4 pb-3 px-4 z-10 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2
            className="font-semibold text-lg"
            style={{ color: stage.color || "#374151" }}
          >
            {stage.name}
          </h2>

          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {sortedOps.length} ops
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Total:{" "}
          {totalMonto.toLocaleString("es-CL", {
            minimumFractionDigits: 0,
          })}
        </p>
      </div>

      <div className="p-4 pt-2 max-h-[75vh] overflow-y-auto pr-2">
        {sortedOps.map((op) => {
          const isDragging = activeId === op.id;

          return (
            <div key={op.id}>
              {isDragging ? (
                // ⭐ Placeholder que ocupa el espacio pero NO muestra la tarjeta
                <div className="h-[120px] rounded-lg bg-transparent" />
              ) : (
                <DraggableWrapper id={op.id}>
                  <OpportunityCard
                    opportunity={op}
                    onEdit={onEdit}
                    onViewOS={onViewOS}
                    onHistorial={onHistorial}
                    setActividadOportunidad={setActividadOportunidad}
                    setShowActividadModal={setShowActividadModal}
                    onCustomer360={onCustomer360}
                  />
                </DraggableWrapper>
              )}
            </div>
          );
        })}

        {sortedOps.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            Sin oportunidades en esta etapa.
          </p>
        )}
      </div>
    </div>
  );
}



