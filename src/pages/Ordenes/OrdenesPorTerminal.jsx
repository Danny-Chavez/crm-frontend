import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ordenesService } from "../../services/ordenes.service";
import OrdenesTable from "./OrdenesTable";
import OrdenForm from "./OrdenForm";

export default function OrdenesPorTerminal() {
  const { id } = useParams(); // terminal_id
  const [ordenes, setOrdenes] = useState([]);
  const [terminal, setTerminal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenEdit, setOrdenEdit] = useState(null);

  // NUEVO: modal de detalles
  const [showDetails, setShowDetails] = useState(false);
  const [ordenDetalles, setOrdenDetalles] = useState(null);

  const cargarTerminal = async () => {
    try {
      const res = await fetch(`/terminales/${id}`);
      const data = await res.json();
      setTerminal(data);
    } catch (err) {
      console.error("Error cargando terminal:", err);
    }
  };

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const res = await ordenesService.getByTerminal(id);
      setOrdenes(res.data);
    } catch (err) {
      console.error("Error cargando OS:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarTerminal();
    cargarOrdenes();
  }, [id]);

  const abrirCrear = () => {
    setOrdenEdit(null);
    setModalOpen(true);
  };

  const abrirEditar = (orden) => {
    setOrdenEdit(orden);
    setModalOpen(true);
  };

  // NUEVO: abrir modal de detalles
  const abrirDetalles = (orden) => {
    setOrdenDetalles(orden);
    setShowDetails(true);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* ENCABEZADO CORPORATIVO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            OS del Terminal {terminal?.serie || ""}
          </h1>
          <p className="text-sm text-text-secondary">
            Gestión de OS asociadas al terminal
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
        >
          Crear OS
        </button>
      </div>

      {/* TABLA */}
      {loading ? (
        <div className="text-text-secondary">Cargando...</div>
      ) : (
        <OrdenesTable
          ordenes={ordenes}
          onEdit={abrirEditar}
          onView={abrirDetalles}   // ← NUEVO
        />
      )}

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <OrdenForm
          orden={ordenEdit}
          terminal_id={id}
          comercio_id={terminal?.comercio_id}
          onClose={() => setModalOpen(false)}
          onSaved={cargarOrdenes}
        />
      )}

      {/* MODAL DETALLES */}
      {showDetails && ordenDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">

            <h2 className="text-2xl font-bold mb-4">Detalles de la OS</h2>

            <div className="space-y-2">
              <p><strong>ID:</strong> {ordenDetalles.id}</p>
              <p><strong>Fecha:</strong> {ordenDetalles.fecha}</p>
              <p><strong>Estado:</strong> {ordenDetalles.estado}</p>
              <p><strong>Descripción:</strong> {ordenDetalles.descripcion}</p>
              <p><strong>Resultado:</strong> {ordenDetalles.resultado}</p>
              <p><strong>Prioridad:</strong> {ordenDetalles.prioridad}</p>
              <p><strong>Categoría:</strong> {ordenDetalles.categoria}</p>
              <p><strong>Técnico:</strong> {ordenDetalles.tecnico}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

