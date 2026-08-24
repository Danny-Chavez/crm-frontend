import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { ordenesService } from "../../services/ordenes.service";
import { useState } from "react";

// ⭐ IMPORTANTE: definir user para evitar ReferenceError
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export default function OrdenesTable({
  ordenes,
  onEdit,
  onView,
  onDelete,

  filtroEstado,
  setFiltroEstado,
  filtroCategoria,
  setFiltroCategoria,
  filtroComercio,
  setFiltroComercio,
  busqueda,
  setBusqueda,
}) {
  const user = getUser();

  // ⭐ Estados locales para evitar bloqueo del input
  const [localComercio, setLocalComercio] = useState(filtroComercio);
  const [localRut, setLocalRut] = useState(busqueda);

  /* ⭐ LIMPIAR OS ANTES DE ENVIARLA AL FORMULARIO */
  const limpiarOS = (o) => ({
    ...o,
    tecnico_id: o.tecnico_id || "",
    prioridad: o.prioridad || "",
    categoria: o.categoria || "",
    origen: o.origen || "",
    descripcion: o.descripcion || "",
  });

  /* ⭐ FUNCIÓN CLONAR OS */
  const handleClone = async (id) => {
    try {
      const nueva = await ordenesService.clonar(id);
      onEdit(limpiarOS(nueva));
    } catch (err) {
      console.error("❌ Error clonando OS:", err);
      alert("Error al clonar OS");
    }
  };

  const normalizar = (v) =>
    v?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  /* ⭐ SANEAR CAMPOS QUE PUEDAN CONTENER /uploads */
  const sanearCampo = (v) => {
    if (!v) return "";
    if (typeof v !== "string") return v;
    if (v.includes("/uploads/")) return "(archivo antiguo eliminado)";
    return v;
  };

  const badgeEstado = (estado) => {
    const e = normalizar(estado);
    if (e.includes("pend")) return "bg-[#F97316]/20 text-[#C65E12]";
    if (e.includes("proceso")) return "bg-[#0057B8]/20 text-[#003F82]";
    if (e.includes("stand")) return "bg-[#6B7280]/20 text-[#1F2937]";
    if (e.includes("cerrada ok")) return "bg-green-100 text-green-700";
    if (e.includes("cerrada nok")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  /* ⭐ EXPORTAR EXCEL */
  const exportarExcel = () => {
    if (ordenes.length === 0) return;

    const encabezados = Object.keys(ordenes[0]);
    const filas = ordenes.map((o) =>
      encabezados.map((key) => sanearCampo(o[key]))
    );

    const csvContent =
      encabezados.join(",") +
      "\n" +
      filas.map((f) => f.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ordenes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ⭐ Obtener valores reales para los filtros (solo de la página actual)
  const estadosReales = [...new Set(ordenes.map((o) => o.estado))];
  const categoriasReales = [...new Set(ordenes.map((o) => o.categoria))];

  return (
    <div className="bg-surface rounded-xl shadow-md overflow-hidden font-sans p-4">

      {/* FILTROS */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">

        {/* FILTRO ESTADO */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
            <FunnelIcon className="w-4 h-4 text-primary" />
            Estado
          </label>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-border rounded-lg p-2 text-sm mt-1"
          >
            <option value="todos">Todos</option>
            {estadosReales.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* FILTRO CATEGORÍA */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
            <FunnelIcon className="w-4 h-4 text-primary" />
            Categoría
          </label>

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-border rounded-lg p-2 text-sm mt-1"
          >
            <option value="todos">Todas</option>
            {categoriasReales.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* FILTRO COMERCIO */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-primary" />
            Código comercio
          </label>

          <input
            type="text"
            placeholder="Ej: 2220000289"
            value={localComercio}
            onChange={(e) => setLocalComercio(e.target.value)}
            onBlur={() => setFiltroComercio(localComercio)}
            className="border border-border rounded-lg p-2 text-sm mt-1 w-48"
          />
        </div>

        {/* BÚSQUEDA RUT */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-primary" />
            Buscar por RUT
          </label>

          <input
            type="text"
            placeholder="Ej: 12.345.678-9"
            value={localRut}
            onChange={(e) => setLocalRut(e.target.value)}
            onBlur={() => setBusqueda(localRut)}
            className="border border-border rounded-lg p-2 text-sm mt-1 w-48"
          />
        </div>

        {/* EXPORTAR EXCEL */}
        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition self-end"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Exportar Excel
        </button>
      </div>

      {/* TABLA */}
      <table className="w-full text-sm text-text-main">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 text-left">OS #</th>
            <th className="p-4 text-left">Cliente (RUT)</th>
            <th className="p-4 text-left">Nombre Fantasía</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-left">Fecha creación</th>
            <th className="p-4 text-left">Técnico</th>
            <th className="p-4 text-left">Categoría</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ordenes.map((o, index) => (
            <tr
              key={o.id}
              className={`border-t border-border hover:bg-gray-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {/* OS # */}
              <td className="p-4 font-semibold text-blue-600 flex flex-col">
                <span>OS #{o.id}</span>

                {o.clonada_de && (
                  <span className="text-xs text-purple-700 bg-purple-100 border border-purple-300 px-2 py-1 rounded mt-1 w-fit">
                    Clonada desde #{o.clonada_de}
                  </span>
                )}
              </td>

              {/* Cliente */}
              <td className="p-4">{sanearCampo(o.cliente_rut)}</td>

              {/* Nombre Fantasía */}
              <td className="p-4">
                {sanearCampo(o.nombre_fantasia) || (
                  <span className="text-gray-400">—</span>
                )}
              </td>

              {/* Estado */}
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${badgeEstado(
                    o.estado
                  )}`}
                >
                  {sanearCampo(o.estado)}
                </span>
              </td>

              {/* Fecha creación */}
              <td className="p-4">
                {o.fecha_creacion
                  ? new Date(o.fecha_creacion).toLocaleString()
                  : ""}
              </td>

              {/* Técnico */}
              <td className="p-4">{sanearCampo(o.tecnico) || "Sin técnico"}</td>

              {/* Categoría */}
              <td className="p-4">
                {sanearCampo(o.categoria) || "Sin categoría"}
              </td>

              {/* Acciones */}
              <td className="p-4">
                <div className="flex justify-end gap-2">

                  {/* Ver */}
                  <button
                    onClick={() => onView(o)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  >
                    <EyeIcon className="w-4 h-4" /> Ver
                  </button>

                  {/* Editar */}
                  {["Técnico", "Admin", "SuperAdmin", "Supervisor"].includes(
                    user?.rol
                  ) && (
                    <button
                      onClick={() => onEdit(limpiarOS(o))}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Editar
                    </button>
                  )}

                  {/* Clonar */}
                  {["Técnico", "Admin", "SuperAdmin", "Supervisor"].includes(
                    user?.rol
                  ) && (
                    <button
                      onClick={() => handleClone(o.id)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Clonar
                    </button>
                  )}

                  {/* Eliminar */}
                  {user?.rol === "SuperAdmin" && onDelete && (
                    <button
                      onClick={() => onDelete(o.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" /> Eliminar
                    </button>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}







