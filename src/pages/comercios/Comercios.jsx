import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import ComercioForm from "./ComercioForm";

const Comercios = () => {
  const { cliente_id } = useParams();

  const [comercios, setComercios] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState(null);

  // ⭐ Modo solo lectura
  const [viewMode, setViewMode] = useState(false);

  const fetchCliente = async () => {
    try {
      const res = await api.get(`/api/clientes/${cliente_id}`);
      setCliente(res.data);
    } catch (err) {
      console.error("Error cargando cliente:", err);
    }
  };

  const fetchComercios = async () => {
    try {
      const res = await api.get(`/api/comercios/cliente/${cliente_id}`);
      setComercios(res.data);
    } catch (err) {
      console.error("Error cargando comercios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
    fetchComercios();
  }, [cliente_id]);

  const handleCreate = () => {
    setSelectedComercio(null);
    setViewMode(false);
    setShowForm(true);
  };

  const handleEdit = (comercio) => {
    setSelectedComercio(comercio);
    setViewMode(false);
    setShowForm(true);
  };

  const handleView = (comercio) => {
    setSelectedComercio(comercio);
    setViewMode(true);
    setShowForm(true);
  };

  const handleDelete = async (comercioId) => {
    if (!confirm("¿Eliminar comercio?")) return;

    try {
      await api.delete(`/api/comercios/${comercioId}`);
      fetchComercios();
    } catch (err) {
      console.error("Error eliminando comercio:", err);
    }
  };

  if (loading) return <p>Cargando comercios...</p>;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Título */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Comercios de {cliente?.nombre_empresa}
        </h1>

        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          + Nuevo Comercio
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <ComercioForm
          cliente_id={cliente_id}
          comercio={selectedComercio}
          viewMode={viewMode}
          onClose={() => setShowForm(false)}
          onSaved={fetchComercios}
        />
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Dirección</th>
              <th className="p-3 border">Comuna</th>
              <th className="p-3 border">Ciudad</th>
              <th className="p-3 border">Estado</th>
              <th className="p-3 border text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {comercios.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border">{c.nombre_comercio}</td>
                <td className="p-3 border">{c.direccion}</td>
                <td className="p-3 border">{c.comuna}</td>
                <td className="p-3 border">{c.ciudad}</td>
                <td className="p-3 border">{c.estado}</td>

                {/* ⭐ Botones corporativos */}
                <td className="p-3 border flex gap-2 justify-center items-center">

                  <button
                    onClick={() => handleView(c)}
                    className="px-3 py-1 rounded-lg bg-gray-600 text-white text-xs hover:bg-gray-700 transition"
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-xs hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>

                  <button
                    onClick={() =>
                      (window.location.href = `/comercios/${c.id}/terminales`)
                    }
                    className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700 transition"
                  >
                    Terminales
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Comercios;




