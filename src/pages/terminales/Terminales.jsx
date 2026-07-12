import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import TerminalForm from "./TerminalForm";

const Terminales = () => {
  const { comercio_id } = useParams();

  const [terminales, setTerminales] = useState([]);
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  // Modal de detalles
  const [showDetails, setShowDetails] = useState(false);

  const fetchComercio = async () => {
    try {
      const res = await api.get(`/comercios/${comercio_id}`);
      setComercio(res.data);
    } catch (err) {
      console.error("Error cargando comercio:", err);
    }
  };

  const fetchTerminales = async () => {
    try {
      const res = await api.get(`/terminales/comercio/${comercio_id}`);
      setTerminales(res.data);
    } catch (err) {
      console.error("Error cargando terminales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComercio();
    fetchTerminales();
  }, [comercio_id]);

  const handleCreate = () => {
    setSelectedTerminal(null);
    setShowForm(true);
  };

  const handleEdit = (terminal) => {
    setSelectedTerminal(terminal);
    setShowForm(true);
  };

  const handleDelete = async (terminalId) => {
    if (!confirm("¿Eliminar terminal?")) return;

    try {
      await api.delete(`/terminales/${terminalId}`);
      fetchTerminales();
    } catch (err) {
      console.error("Error eliminando terminal:", err);
    }
  };

  const handleViewDetails = (terminal) => {
    setSelectedTerminal(terminal);
    setShowDetails(true);
  };

  if (loading) return <p>Cargando terminales...</p>;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Título */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Terminales de {comercio?.nombre_comercio}
        </h1>

        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          + Nuevo Terminal
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <TerminalForm
          comercio_id={comercio_id}
          terminal={selectedTerminal}
          onClose={() => setShowForm(false)}
          onSaved={fetchTerminales}
        />
      )}

      {/* Tabla corporativa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">TID</th>
              <th className="p-3 border">Modelo</th>
              <th className="p-3 border">Estado</th>
              <th className="p-3 border text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {terminales.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border">{t.tid}</td>
                <td className="p-3 border">{t.modelo}</td>
                <td className="p-3 border">{t.estado}</td>

                <td className="p-3 border flex gap-2 justify-center items-center">

                  <button
                    onClick={() => handleViewDetails(t)}
                    className="px-3 py-1 rounded-lg bg-gray-600 text-white text-xs hover:bg-gray-700 transition"
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => handleEdit(t)}
                    className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-xs hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>

                  <button
                    onClick={() =>
                      (window.location.href = `/terminales/${t.id}/os`)
                    }
                    className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700 transition"
                  >
                    OS
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedTerminal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Detalles del Terminal
            </h2>

            <div className="space-y-2 text-sm">
              <p><strong>TID:</strong> {selectedTerminal.tid}</p>
              <p><strong>Tipo:</strong> {selectedTerminal.tipo}</p>
              <p><strong>Modelo:</strong> {selectedTerminal.modelo}</p>
              <p><strong>Serie:</strong> {selectedTerminal.serie}</p>
              <p><strong>Marca:</strong> {selectedTerminal.marca}</p>
              <p><strong>Versión:</strong> {selectedTerminal.version}</p>
              <p><strong>SIM Card:</strong> {selectedTerminal.simcard}</p>
              <p><strong>Estado:</strong> {selectedTerminal.estado}</p>
              <p><strong>Creado:</strong> {selectedTerminal.created_at}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Terminales;
