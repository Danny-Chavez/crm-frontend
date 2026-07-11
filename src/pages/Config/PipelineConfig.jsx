/* ============================
   1. Imports
   ============================ */
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

/* ============================
   2. Componentes internos
   ============================ */

// Item draggable
function StageItem({ stage, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: stage.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div className="flex items-center justify-between w-full p-3 bg-white border rounded-lg shadow-sm gap-4">

      {/* Área draggable */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex items-center gap-3 flex-1"
      >
        <div
          className="w-4 h-4 rounded-full border"
          style={{ backgroundColor: stage.color }}
        ></div>

        <p className="font-medium truncate">{stage.nombre}</p>

        {/* Badges */}
        {stage.crea_os && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
            Crea OS
          </span>
        )}

        {stage.es_final && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
            Final
          </span>
        )}

        {!stage.visible && (
          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
            Oculta
          </span>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(stage);
          }}
          className="text-blue-600 text-sm hover:underline"
        >
          Editar
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(stage.id);
          }}
          className="text-red-600 text-sm hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );


}

// Zona droppable
function StageDropZone({ stage, children }) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  return (
    <div ref={setNodeRef} className="mb-3 w-full">
      {children}
    </div>
  );
}

/* ============================
   3. Componente principal
   ============================ */

export default function PipelineConfig() {
  const [stages, setStages] = useState([]);

  // Crear etapa
  const [newStage, setNewStage] = useState({
    nombre: "",
    color: "#3b82f6",
    activo: true,
    crea_os: false,
    es_final: false,
    visible: true,
  });

  // Modal editar etapa
  const [editingStage, setEditingStage] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    color: "#3b82f6",
    activo: true,
    crea_os: false,
    es_final: false,
    visible: true,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  /* ============================
     4. Cargar etapas desde backend (TODAS)
     ============================ */
  useEffect(() => {
    api.get("/api/pipeline-stages/all").then((res) => {
      const sorted = res.data.sort((a, b) => a.orden - b.orden);
      setStages(sorted);
    });
  }, []);

  /* ============================
     5. Crear etapa
     ============================ */
  const handleAddStage = async () => {
    if (!newStage.nombre.trim()) return;

    const payload = {
      ...newStage,
      orden: stages.length + 1,
    };

    const res = await api.post("/api/pipeline-stages", payload);

    const created = res.data?.id ? res.data : { ...payload, id: Date.now() };

    setStages([...stages, created].sort((a, b) => a.orden - b.orden));

    setNewStage({
      nombre: "",
      color: "#3b82f6",
      activo: true,
      crea_os: false,
      es_final: false,
      visible: true,
    });
  };

  /* ============================
     6. Eliminar etapa
     ============================ */
  const handleDeleteStage = async (id) => {
    await api.delete(`/api/pipeline-stages/${id}`);
    setStages(stages.filter((s) => s.id !== id));
  };

  /* ============================
     7. Abrir modal editar
     ============================ */
  const handleEditOpen = (stage) => {
    setEditingStage(stage);

    setEditForm({
      nombre: stage.nombre,
      color: stage.color,
      activo: stage.activo,
      crea_os: stage.crea_os,
      es_final: stage.es_final,
      visible: stage.visible,
    });
  };

  /* ============================
     8. Guardar edición
     ============================ */
  const handleEditSave = async () => {
    const updated = {
      nombre: editForm.nombre,
      color: editForm.color,
      activo: editForm.activo,
      crea_os: editForm.crea_os,
      es_final: editForm.es_final,
      visible: editForm.visible,
    };

    const res = await api.put(`/api/pipeline-stages/${editingStage.id}`, updated);

    const finalData = res.data?.id ? res.data : { ...editingStage, ...updated };

    setStages((prev) =>
      prev.map((s) => (s.id === editingStage.id ? finalData : s))
    );

    setEditingStage(null);
  };

  /* ============================
     9. Drag & Drop reordenamiento
     ============================ */
  const handleDragEnd = async ({ active, over }) => {
    if (!active || !over) return;
    if (active.id === over.id) return;

    const oldIndex = stages.findIndex((s) => s.id === active.id);
    const newIndex = stages.findIndex((s) => s.id === over.id);

    const reordered = [...stages];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((s, index) => ({
      ...s,
      orden: index + 1,
    }));

    setStages(updated);

    await api.put("/api/pipeline-stages/bulk/reorder", updated);
  };

  /* ============================
     10. Render
     ============================ */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración del Pipeline</h1>

      {/* Crear nueva etapa */}
      <div className="bg-white p-4 rounded-xl shadow-md border mb-6">
        <h2 className="text-lg font-semibold mb-4">Crear nueva etapa</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Nombre</label>
            <input
              type="text"
              value={newStage.nombre}
              onChange={(e) =>
                setNewStage({ ...newStage, nombre: e.target.value })
              }
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Color</label>
            <input
              type="color"
              value={newStage.color}
              onChange={(e) =>
                setNewStage({ ...newStage, color: e.target.value })
              }
              className="w-full p-2 border rounded-lg mt-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newStage.activo}
              onChange={(e) =>
                setNewStage({ ...newStage, activo: e.target.checked })
              }
            />
            <label>Activo</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newStage.crea_os}
              onChange={(e) =>
                setNewStage({ ...newStage, crea_os: e.target.checked })
              }
            />
            <label>Crea OS automáticamente</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newStage.es_final}
              onChange={(e) =>
                setNewStage({ ...newStage, es_final: e.target.checked })
              }
            />
            <label>Etapa final</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newStage.visible}
              onChange={(e) =>
                setNewStage({ ...newStage, visible: e.target.checked })
              }
            />
            <label>Visible en Pipeline</label>
          </div>
        </div>

        <button
          onClick={handleAddStage}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Crear etapa
        </button>
      </div>

      {/* Lista de etapas */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center gap-3">

              <StageDropZone stage={stage}>
                <StageItem
                  stage={stage}
                  onEdit={handleEditOpen}
                  onDelete={handleDeleteStage}
                />
              </StageDropZone>



            </div>
          ))}
        </div>
      </DndContext>

      {/* MODAL EDITAR */}
      {editingStage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Editar etapa</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Color</label>
                <input
                  type="color"
                  value={editForm.color}
                  onChange={(e) =>
                    setEditForm({ ...editForm, color: e.target.value })
                  }
                  className="w-16 h-10 p-1 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Activo</label>
                <input
                  type="checkbox"
                  checked={editForm.activo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, activo: e.target.checked })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Crea OS automáticamente</label>
                <input
                  type="checkbox"
                  checked={editForm.crea_os}
                  onChange={(e) =>
                    setEditForm({ ...editForm, crea_os: e.target.checked })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Etapa final</label>
                <input
                  type="checkbox"
                  checked={editForm.es_final}
                  onChange={(e) =>
                    setEditForm({ ...editForm, es_final: e.target.checked })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Visible en Pipeline</label>
                <input
                  type="checkbox"
                  checked={editForm.visible}
                  onChange={(e) =>
                    setEditForm({ ...editForm, visible: e.target.checked })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingStage(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleEditSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}




