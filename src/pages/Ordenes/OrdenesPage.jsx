import { useEffect, useState } from "react";
import { ordenesService } from "../../services/ordenes.service";
import OrdenesTable from "./OrdenesTable";
import OrdenForm from "./OrdenForm";

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenEdit, setOrdenEdit] = useState(null);

  // Modal detalles
  const [showDetails, setShowDetails] = useState(false);
  const [ordenDetalles, setOrdenDetalles] = useState(null);

  const cargarOrdenes = async () => {
    setLoading(true);
    const res = await ordenesService.getAll();
    setOrdenes(res.data);
    setLoading(false);
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const abrirCrear = () => {
    setOrdenEdit(null);
    setModalOpen(true);
  };

  const abrirEditar = (orden) => {
    setOrdenEdit(orden);
    setModalOpen(true);
  };

  const abrirDetalles = (orden) => {
    setOrdenDetalles(orden);
    setShowDetails(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar OS definitivamente?")) return;

    try {
      await ordenesService.remove(id);
      setOrdenes(ordenes.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error eliminando OS:", err);
      alert("No se pudo eliminar la OS");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* ENCABEZADO CORPORATIVO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Órdenes de Servicio</h1>
          <p className="text-sm text-text-secondary">
            Gestión de OS del CRM Tas Chile
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
          onView={abrirDetalles}
          onDelete={handleDelete}
        />
      )}

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <OrdenForm
          orden={ordenEdit}
          cliente_rut={ordenEdit?.cliente_rut || ""}
          comercio_id={ordenEdit?.comercio_id || ""}
          terminal_id={ordenEdit?.dispositivo_id || ""}
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
              <p><strong>Fecha:</strong> {ordenDetalles.fecha_creacion}</p>
              <p><strong>Estado:</strong> {ordenDetalles.estado}</p>
              <p><strong>Cliente:</strong> {ordenDetalles.cliente_rut}</p>
              <p><strong>Comercio:</strong> {ordenDetalles.comercio_id}</p>
              <p><strong>Terminal:</strong> {ordenDetalles.dispositivo_id}</p>
              <p><strong>Descripción:</strong> {ordenDetalles.descripcion}</p>
              <p><strong>Resultado:</strong> {ordenDetalles.resultado}</p>
              <p><strong>Prioridad:</strong> {ordenDetalles.prioridad}</p>
              <p><strong>Categoría:</strong> {ordenDetalles.categoria}</p>
              <p><strong>Técnico:</strong> {ordenDetalles.tecnico}</p>

              {/* NUEVOS CAMPOS */}
              <p><strong>Fono Contacto:</strong> {ordenDetalles.fono_contacto}</p>
              <p><strong>Falla:</strong> {ordenDetalles.falla}</p>
              <p><strong>Número de Serie:</strong> {ordenDetalles.num_serie}</p>
              <p><strong>Nombre quien retira:</strong> {ordenDetalles.nom_retira}</p>
              <p><strong>Dirección despacho:</strong> {ordenDetalles.dir_despacho}</p>
              <p><strong>Comuna despacho:</strong> {ordenDetalles.com_despacho}</p>
              <p><strong>Número de serie cambio:</strong> {ordenDetalles.num_serie_cambio}</p>
              <p><strong>OS IN:</strong> {ordenDetalles.os_in}</p>
              <p><strong>OS OUT:</strong> {ordenDetalles.os_out}</p>
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





