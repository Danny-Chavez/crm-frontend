import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OpportunityCard from "./PipelineCard";

function SortableCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 9998 : "auto",
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
  activeId,
}) {

  // ⭐ FIX CRÍTICO: droppable con data para identificar la columna
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: {
      id: stage.id,
      type: "column",
    },
  });

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
      </div>

      <div className="p-4 pt-2 max-h-[75vh] overflow-visible pr-2">
        {sortedOps.map((op) => {
          const isDragging = activeId === op.id;

          return (
            <div key={op.id}>
              {isDragging ? (
                <div className="h-[130px] rounded-lg bg-transparent" />
              ) : (
                <SortableCard id={op.id}>
                  <OpportunityCard
                    opportunity={op}
                    onEdit={onEdit}
                    onViewOS={onViewOS}
                    onHistorial={onHistorial}
                    setActividadOportunidad={setActividadOportunidad}
                    setShowActividadModal={setShowActividadModal}
                    onCustomer360={onCustomer360}
                  />
                </SortableCard>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}






