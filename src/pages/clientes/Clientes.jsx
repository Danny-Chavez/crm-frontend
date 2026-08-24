import { useEffect, useState } from "react";
import api from "../../utils/axios";
import ClienteForm from "./ClienteForm";
import Customer360 from "../../components/Customer360";
import { useLocation } from "react-router-dom";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(20); // puedes ajustar
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();

  // ⭐ Filtro por RUT
  const [filtroRut, setFiltroRut] = useState("");

  // ⭐ Modo solo lectura (Ver)
  const [viewMode, setViewMode] = useState(false);

  // ⭐ Customer360 modal
  const [showCustomer360, setShowCustomer360] = useState(false);
  const [customerRut, setCustomerRut] = useState(null);

  const fetchClientes = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/clientes?page=${pageNumber}&limit=${limit}&rut=${filtroRut}`
      );

      setClientes(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);

    } catch (err) {
      console.error("Error cargando clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes(1);
  }, []);

  // ⭐ Refrescar cuando cambia el filtro
  useEffect(() => {
    fetchClientes(1);
  }, [filtroRut]);

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setViewMode(false);
    setShowForm(true);
  };

  const handleView = (cliente) => {
    setCustomerRut(cliente.rut);
    setShowCustomer360(true);
  };

  const handleCreate = () => {
    setSelectedCliente(null);
    setViewMode(false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;

    try {
      await api.delete(`/clientes/${id}`);
      fetchClientes(page);
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    }
  };

  if (loading) return <p>Cargando clientes...</p>;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Título */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>

        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* ⭐ Filtro por RUT */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filtros</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">RUT / Empresa</label>
            <input
              type="text"
              className="input-base"
              placeholder="Ej: 12.345.678-K"
              value={filtroRut}
              onChange={(e) => setFiltroRut(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <ClienteForm
          cliente={selectedCliente}
          viewMode={viewMode}
          onClose={() => setShowForm(false)}
          onSaved={() => fetchClientes(page)}
        />
      )}

      {/* ⭐ Modal Customer360 */}
      {showCustomer360 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl p-6 rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <Customer360 rut={customerRut} onClose={() => setShowCustomer360(false)} />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">RUT</th>
              <th className="p-3 border">Empresa</th>
              <th className="p-3 border">Teléfono</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Vendedor</th>
              <th className="p-3 border">Estado</th>
              <th className="p-3 border text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border">{c.rut}</td>
                <td className="p-3 border">{c.nombre_empresa}</td>
                <td className="p-3 border">{c.telefono}</td>
                <td className="p-3 border">{c.email}</td>
                <td className="p-3 border">{c.vendedor}</td>
                <td className="p-3 border">{c.estado}</td>

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
                      (window.location.href = `/clientes/${c.id}/comercios`)
                    }
                    className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs hover:bg-green-700 transition"
                  >
                    Comercios
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ⭐ Paginación */}
      <div className="flex items-center justify-center gap-4 mt-4">

        <button
          disabled={page <= 1}
          onClick={() => fetchClientes(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Anterior
        </button>

        <span className="text-gray-700">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => fetchClientes(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente →
        </button>

      </div>

      <p className="text-sm text-gray-500 mt-2 text-center">
        Total clientes: {totalItems}
      </p>

    </div>
  );
};

export default Clientes;







