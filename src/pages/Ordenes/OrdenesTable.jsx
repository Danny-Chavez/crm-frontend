import { useState, useMemo } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import { ordenesService } from "../../services/ordenes.service";

export default function OrdenesTable({ ordenes, onEdit, onView, onDelete }) {

    console.log("ORDENES RECIBIDAS:", ordenes);  // ⭐ AGREGA ESTO
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroComercio, setFiltroComercio] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  // ⭐ FUNCIÓN CLONAR OS
  const handleClone = async (id) => {
    try {
      const nueva = await ordenesService.clonar(id);
      onEdit(nueva);
    } catch (err) {
      console.error("❌ Error clonando OS:", err);
      alert("Error al clonar OS");
    }
  };

  const normalizar = (v) =>
    v
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const badgeEstado = (estado) => {
    const e = normalizar(estado);
    if (e.includes("pend")) return "bg-[#F97316]/20 text-[#C65E12]";
    if (e.includes("proceso")) return "bg-[#0057B8]/20 text-[#003F82]";
    if (e.includes("stand")) return "bg-[#6B7280]/20 text-[#1F2937]";
    if (e.includes("cerrada ok")) return "bg-green-100 text-green-700";
    if (e.includes("cerrada nok")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const estadosReales = [...new Set(ordenes.map((o) => o.estado))];
  const categoriasReales = [...new Set(ordenes.map((o) => o.categoria))];

  const filtradas = useMemo(() => {
    return ordenes
      .filter((o) =>
        filtroEstado === "todos"
          ? true
          : normalizar(o.estado) === normalizar(filtroEstado)
      )
      .filter((o) =>
        filtroCategoria === "todos"
          ? true
          : normalizar(o.categoria) === normalizar(filtroCategoria)
      )
      .filter((o) =>
        filtroComercio.trim() === ""
          ? true
          : o.comercio_id?.toString().includes(filtroComercio)
      )
      .filter((o) =>
        o.cliente_rut?.toLowerCase().includes(busqueda.toLowerCase())
      )
      .sort(
        (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
  }, [ordenes, filtroEstado, filtroCategoria, filtroComercio, busqueda]);

  const totalPaginas = Math.ceil(filtradas.length / porPagina);
  const visibles = filtradas.slice(
    (pagina - 1) * porPagina,
    pagina * porPagina
  );

  const exportarExcel = () => {
    if (filtradas.length === 0) return;

    const encabezados = [
      "Cliente RUT",
      "Estado",
      "Fecha creación",
      "Descripción",
      "Técnico",
      "Prioridad",
      "Categoría",
      "Comercio ID",
    ];

    const filas = filtradas.map((o) => [
      o.cliente_rut || "",
      o.estado || "",
      o.fecha_creacion || "",
      o.descripcion || "",
      o.tecnico || "",
      o.prioridad || "",
      o.categoria || "",
      o.comercio_id || "",
    ]);

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

  return (
    <div className="bg-surface rounded-xl shadow-md overflow-hidden font-sans p-4">
      {/* FILTROS */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        {/* FILTRO ESTADO */}
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-primary" />
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPagina(1);
            }}
            className="border border-border rounded-lg p-2 text-sm"
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
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-primary" />
          <select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value);
              setPagina(1);
            }}
            className="border border-border rounded-lg p-2 text-sm"
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
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
          <input
            type="text"
            placeholder="Código comercio..."
            value={filtroComercio}
            onChange={(e) => {
              setFiltroComercio(e.target.value);
              setPagina(1);
            }}
            className="border border-border rounded-lg p-2 text-sm w-48"
          />
        </div>

        {/* BÚSQUEDA RUT */}
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
          <input
            type="text"
            placeholder="Buscar cliente (RUT)..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            className="border border-border rounded-lg p-2 text-sm w-48"
          />
        </div>

        {/* EXPORTAR EXCEL */}
        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Exportar Excel
        </button>
      </div>

      {/* TABLA */}
      <table className="w-full text-sm text-text-main">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 font-semibold text-left">OS #</th>
            <th className="p-4 font-semibold text-left">Cliente (RUT)</th>
            <th className="p-4 font-semibold text-left">Estado</th>
            <th className="p-4 font-semibold text-left">Fecha creación</th>

            {/* ⭐ NUEVO */}
            <th className="p-4 font-semibold text-left">Técnico</th>
            <th className="p-4 font-semibold text-left">Categoría</th>

            <th className="p-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {visibles.map((o, index) => (
            <tr
              key={o.id}
              className={`border-t border-border hover:bg-gray-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="p-4 font-semibold text-blue-600 flex flex-col">
                <span>OS #{o.id}</span>

                {o.clonada_de && (
                  <span className="text-xs text-purple-700 bg-purple-100 border border-purple-300 px-2 py-1 rounded mt-1 w-fit">
                    Clonada desde #{o.clonada_de}
                  </span>
                )}
              </td>

              <td className="p-4">{o.cliente_rut}</td>

              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${badgeEstado(
                    o.estado
                  )}`}
                >
                  {o.estado}
                </span>
              </td>

              <td className="p-4">
                {o.fecha_creacion
                  ? new Date(o.fecha_creacion).toLocaleString()
                  : ""}
              </td>

              {/* ⭐ TÉCNICO */}
              <td className="p-4">
                {o.tecnico || "Sin técnico"}
              </td>

              {/* ⭐ CATEGORÍA */}
              <td className="p-4">
                {o.categoria || "Sin categoría"}
              </td>

              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(o)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  >
                    <EyeIcon className="w-4 h-4" /> Ver
                  </button>

                  <button
                    onClick={() => onEdit(o)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" /> Editar
                  </button>

                  <button
                    onClick={() => handleClone(o.id)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  >
                    <PencilSquareIcon className="w-4 h-4" /> Clonar
                  </button>

                  {onDelete && (
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

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          ←
        </button>

        <span className="text-sm font-semibold">
          Página {pagina} de {totalPaginas}
        </span>

        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}



