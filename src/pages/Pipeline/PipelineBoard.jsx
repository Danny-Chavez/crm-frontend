import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import StageColumn from "./PipelineColumn";
import OpportunityCard from "./PipelineCard";

export default function PipelineBoard({
  stages,
  finalStages,
  filteredOps,
  opsByStage,
  pages,
  totalPages,
  sensors,
  activeId,
  setActiveId,
  handleDragEnd,
  applyFilters,
  fetchStageOps,
  opportunities,
  handleEditOpen,
  onViewOS,
  cargarHistorial,
  setActividadOportunidad,
  setShowActividadModal,
  onCustomer360,
}) {
  return (
    <div className="overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          if (event?.active?.id) {
            setActiveId(event.active.id);
          }
        }}
        onDragEnd={(event) => {
          // ⭐ LIMPIAR activeId ANTES de cualquier animación
          setActiveId(null);

          // ⭐ Ejecutar la lógica de mover la tarjeta
          handleDragEnd(event);
        }}
      >
        <div className="flex gap-4 w-max">
          {stages
            .filter((s) => s.activo)
            .map((stage) => {
              const isFinal = finalStages.includes(stage.id);

              const opsForStage = isFinal
                ? applyFilters(opsByStage[stage.id] || [])
                : filteredOps.filter((op) => op.stage === stage.id);

              return (
                <SortableContext
                  key={stage.id + "-" + opsForStage.length}
                  items={opsForStage.map((op) => op.id)}
                >
                  <div className="flex flex-col">
                    <StageColumn
                      stage={stage}
                      opportunities={opsForStage}
                      onEdit={handleEditOpen}
                      onViewOS={onViewOS}
                      onHistorial={cargarHistorial}
                      setActividadOportunidad={setActividadOportunidad}
                      setShowActividadModal={setShowActividadModal}
                      onCustomer360={onCustomer360}
                      activeId={activeId}
                    />

                    {isFinal && (
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <button
                          disabled={(pages[stage.id] || 1) <= 1}
                          onClick={() =>
                            fetchStageOps(stage.id, (pages[stage.id] || 1) - 1)
                          }
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          ←
                        </button>

                        <span className="text-sm text-gray-700">
                          Página {pages[stage.id] || 1} de {totalPages[stage.id] || 1}
                        </span>

                        <button
                          disabled={(pages[stage.id] || 1) >= (totalPages[stage.id] || 1)}
                          onClick={() =>
                            fetchStageOps(stage.id, (pages[stage.id] || 1) + 1)
                          }
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                </SortableContext>
              );
            })}
        </div>

        {/* ⭐ Overlay liviano para evitar rebote */}
        <DragOverlay className="z-[9999] pointer-events-none">
          {activeId ? (
            <div className="opacity-80 scale-[0.98] pointer-events-none">
              <OpportunityCard
                opportunity={opportunities.find((o) => o.id === activeId)}
                dragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>
    </div>
  );
}







