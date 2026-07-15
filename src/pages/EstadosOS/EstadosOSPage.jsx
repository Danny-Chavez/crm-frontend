import { useEffect, useState } from "react";
import { estadosOSService } from "../../services/estados-os.service";
import EstadosOSTable from "./EstadosOSTable";
import EstadoOSForm from "./EstadoOSForm";

export default function EstadosOSPage() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [estadoEdit, setEstadoEdit] = useState(null);

  const cargarEstados = async () => {
    setLoading(true);
    const res = await estadosOSService.getAll();
    setEstados(res.data);
    setLoading(false);
  };

  useEffect(() => {
    cargarEstados();
  }, []);

  const abrirCrear = () => {
    setEstadoEdit(null);
    setModalOpen(true);
  };

  const abrirEditar = (estado) => {
    setEstadoEdit(estado);
    setModalOpen(true);
  };

  /* ⭐ ELIMINAR ESTADO */
  const eliminarEstado = async (estado) => {
    const confirmar = window.confirm(
      `¿Eliminar el estado "${estado.nombre}"?`
    );

    if (!confirmar) return;

    try {
      await estadosOSService.delete(estado.id);
      await cargarEstados();
    } catch (err) {
      console.error("❌ Error eliminando estado:", err);
      alert("No se pudo eliminar el estado.");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* ENCABEZADO CORPORATIVO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Estados de Órdenes de Servicio
          </h1>
          <p className="text-sm text-text-secondary">
            Gestión de estados del CRM Tas Chile
          </p>
        </div>

        <button
          onClick={abrirCrear}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
        >
          Crear Estado
        </button>
      </div>

      {/* TABLA */}
      {loading ? (
        <div className="text-text-secondary">Cargando...</div>
      ) : (
        <EstadosOSTable
          estados={estados}
          onEdit={abrirEditar}
          onDelete={eliminarEstado}
        />
      )}

      {/* MODAL */}
      {modalOpen && (
        <EstadoOSForm
          estado={estadoEdit}
          onClose={() => setModalOpen(false)}
          onSaved={cargarEstados}
        />
      )}
    </div>
  );
}

