/* ============================
   1. Imports
   ============================ */
import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { validarRut, normalizarRut } from "../../utils/rut";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Customer360 from "../../components/Customer360";


/* ============================
   2. Componentes internos
   ============================ */

function OpportunityCard({
  opportunity,
  onEdit,
  onViewOS,
  onHistorial,
  setActividadOportunidad,
  setShowActividadModal,
  onCustomer360   // ✔ Se recibe desde Pipeline.jsx
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: opportunity.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition: "transform 0.2s ease",
  };

  const monto = Number(opportunity.amount || opportunity.monto || 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-3 hover:shadow-lg transition-all duration-300"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-gray-800">
            {opportunity.empresa || "Sin empresa"}
          </p>
          {opportunity.id && (
            <span className="text-xs text-gray-400">#{opportunity.id}</span>
          )}
        </div>

        <p className="text-sm text-gray-700">
          💰{" "}
          {monto.toLocaleString("es-CL", {
            minimumFractionDigits: 0,
          })}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          👤 {opportunity.vendedor || "Sin responsable"}
        </p>
      </div>

      {opportunity.os_id && (
        <div className="mt-2 flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
            OS #{opportunity.os_id}
          </span>

          <button
            onClick={() => onViewOS(opportunity.os_id)}
            className="text-blue-600 text-xs underline hover:text-blue-800"
          >
            Ver OS
          </button>
        </div>
      )}

      {/* ⭐ SECCIÓN DE BOTONES */}
      <div className="mt-3 flex items-center gap-3 text-xs">
        <button
          onClick={() => onHistorial(opportunity.id)}
          className="text-gray-600 hover:text-gray-800 hover:underline"
        >
          Ver historial
        </button>

        <button
          onClick={() => onEdit(opportunity)}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Editar
        </button>

        <button
          onClick={() => {
            setActividadOportunidad(opportunity.id);
            setShowActividadModal(true);
          }}
          className="text-green-600 hover:text-green-800 hover:underline"
        >
          Registrar actividad
        </button>

        {/* ⭐ NUEVO BOTÓN: VER CLIENTE */}
        <button
          onClick={() => onCustomer360(opportunity.rut)}
          className="text-purple-600 hover:text-purple-800 hover:underline"
        >
          Ver cliente
        </button>
      </div>
    </div>
  );
}


//componente controlados de columnas individuales
function StageColumn({
  stage,
  opportunities,
  onEdit,
  onViewOS,
  onHistorial,
  setActividadOportunidad,
  setShowActividadModal,
  onCustomer360   // ⭐ AGREGADO: StageColumn ahora recibe esta función
}) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  const totalMonto = opportunities.reduce(
    (acc, o) => acc + Number(o.amount || o.monto || 0),
    0
  );

  const sortedOps = [...opportunities].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div
      ref={setNodeRef}
      className="w-80 bg-white rounded-xl border border-gray-100 shadow-lg/30 hover:shadow-xl transition-all duration-300 flex flex-col"
      style={{ borderTop: `4px solid ${stage.color || "#3b82f6"}` }}
    >
      {/* ⭐ Header sticky */}
      <div className="sticky top-0 bg-white pt-4 pb-3 px-4 z-10 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2
            className="font-semibold text-lg"
            style={{ color: stage.color || "#374151" }}
          >
            {stage.name}
          </h2>

          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {sortedOps.length} ops
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Total:{" "}
          {totalMonto.toLocaleString("es-CL", {
            minimumFractionDigits: 0,
          })}
        </p>
      </div>

      {/* ⭐ CONTENEDOR CON SCROLL */}
      <div className="p-4 pt-2 max-h-[75vh] overflow-y-auto pr-2">
        {sortedOps.map((op) => (
          <OpportunityCard
            key={op.id}
            opportunity={op}
            onEdit={onEdit}
            onViewOS={onViewOS}
            onHistorial={onHistorial}
            setActividadOportunidad={setActividadOportunidad}
            setShowActividadModal={setShowActividadModal}
            onCustomer360={onCustomer360}   // ⭐ AGREGADO: ahora sí se envía
          />
        ))}

        {sortedOps.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            Sin oportunidades en esta etapa.
          </p>
        )}
      </div>
    </div>
  );
}




/* ============================
   3. Componente principal
   ============================ */

export default function Pipeline() {
  const navigate = useNavigate();

  const [stages, setStages] = useState([]);
  const [allStages, setAllStages] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  const [vendedores, setVendedores] = useState([]);
  const [productos, setProductos] = useState([]);
  // Actividades de la oportunidad seleccionada
  const [actividades, setActividades] = useState([]);

  const [filters, setFilters] = useState({
    vendedor: "",
    etapa: "",
    montoMin: "",
    montoMax: "",
    rutEmpresa: "",
    mostrarOcultas: false,
  });

    //CUSTOMER 360
    const [showCustomer360, setShowCustomer360] = useState(false);
    const [customerRut, setCustomerRut] = useState(null);

    const onCustomer360 = (rut) => {
      setCustomerRut(rut);
      setShowCustomer360(true);
    };

    /* ============================================================
      Filtros
      ============================================================ */

  const applyFilters = (ops) => {
    let result = [...ops];

    if (filters.vendedor.trim()) {
      result = result.filter((o) =>
        o.vendedor?.toLowerCase().includes(filters.vendedor.toLowerCase())
      );
    }

    if (filters.etapa) {
      result = result.filter((o) => o.stage === Number(filters.etapa));
    }

    if (filters.montoMin) {
      result = result.filter(
        (o) => Number(o.amount || o.monto) >= Number(filters.montoMin)
      );
    }

    if (filters.montoMax) {
      result = result.filter(
        (o) => Number(o.amount || o.monto) <= Number(filters.montoMax)
      );
    }

    if (filters.rutEmpresa.trim()) {
      result = result.filter(
        (o) =>
          o.rut?.includes(filters.rutEmpresa) ||
          o.empresa?.toLowerCase().includes(filters.rutEmpresa.toLowerCase())
      );
    }

    if (filters.mostrarOcultas) {
      result = result.filter((o) =>
        allStages.some((s) => s.id === o.stage && !s.visible)
      );
    }

    return result;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [
          visibleRes,
          allRes,
          oppRes,
          vendedoresRes,
          productosRes,
        ] = await Promise.all([
          api.get("/pipeline-stages"),
          api.get("/pipeline-stages/all"),
          api.get("/oportunidades"),
          api.get("/oportunidades/vendedores"),
          api.get("/oportunidades/productos"),
        ]);

        const visible = visibleRes.data
          .map((s) => ({
            id: s.id,
            name: s.nombre,
            color: s.color,
            activo: s.activo,
            orden: s.orden,
            crea_os: s.crea_os,
            es_final: s.es_final,
          }))
          .sort((a, b) => a.orden - b.orden);

        const all = allRes.data
          .map((s) => ({
            id: s.id,
            name: s.nombre,
            color: s.color,
            activo: s.activo,
            orden: s.orden,
            crea_os: s.crea_os,
            es_final: s.es_final,
            visible: s.visible,
          }))
          .sort((a, b) => a.orden - b.orden);

        setStages(visible);
        setAllStages(all);
        setOpportunities(oppRes.data);

        setVendedores(vendedoresRes.data);
        setProductos(productosRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);
/* ============================
   Estados UI
   ============================ */
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const [historial, setHistorial] = useState([]);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  // Estados para actividades
  const [showActividadModal, setShowActividadModal] = useState(false);
  const [actividadOportunidad, setActividadOportunidad] = useState(null);
  const [actividadTipo, setActividadTipo] = useState("");
  const [actividadComentario, setActividadComentario] = useState("");

  // Estados para registrar pérdida
  const [showPerdidaModal, setShowPerdidaModal] = useState(false);
  const [perdidaOpportunity, setPerdidaOpportunity] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [comentario, setComentario] = useState("");

  const [historialOportunidad, setHistorialOportunidad] = useState(null);

  const [form, setForm] = useState({
    rut: "",
    empresa: "",
    producto: "",
    monto: "",
    vendedor: "",
    telefono: "",
    telefono2: "",
    email: "",
    tipo_ingreso: "",
    stage: 1,

    nombre: "",
    apellido: "",
    direccion: "",
    comuna: "",
    ciudad: "",
    razon_social: "",
    nombre_fantasia: "",
    direccion_comercial: "",
    nombre_rl: "",
    email_rl: "",
    giro: "",
    tipo_abono: "",
    tipo_folios: "",
    chip: "",

    codigo_comercio: "",
    observaciones: "",

    rut_rl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cargarHistorial = async (id) => {
    try {
      const res = await api.get(`/oportunidades/${id}/historial`);
      setHistorial(res.data);
      setHistorialOportunidad(id);
      setShowHistorialModal(true);
    } catch (err) {
      console.error("Error cargando historial:", err);
    }
  };

  const exportPipelineCompleto = async () => {
    const ops = opportunities;

    const dataPipeline = ops.map((o) => ({
      ID: o.id,
      Empresa: o.empresa,
      Producto: o.producto,
      Monto: Number(o.amount || o.monto || 0),
      Vendedor: o.vendedor,
      Etapa: stages.find((s) => s.id === o.stage)?.name || "",
      Fecha_Creación: o.created_at,
      Fecha_Actualización: o.updated_at,
      Fecha_Finalización: o.fecha_finalizacion || "",
      OS_Asociada: o.os_id || "",
    }));

    const encabezados = Object.keys(dataPipeline[0]);

    const filas = dataPipeline.map((o) =>
      encabezados.map((key) => o[key] ?? "—")
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
    a.download = `Pipeline_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ============================
   Crear oportunidad
   ============================ */
  const handleCreate = async () => {
    const rutNormalizado = normalizarRut(form.rut);

    if (form.rut && !validarRut(rutNormalizado)) {
      alert("El RUT ingresado no es válido.");
      return;
    }

    const newOpportunity = {
      rut: rutNormalizado || null,
      empresa: form.empresa,
      producto: form.producto,
      monto: Number(form.monto || 0),
      vendedor: form.vendedor,
      telefono: form.telefono,
      telefono2: form.telefono2,
      email: form.email,
      tipo_ingreso: form.tipo_ingreso,
      stage: Number(form.stage),

      nombre: form.nombre,
      apellido: form.apellido,
      direccion: form.direccion,
      comuna: form.comuna,
      ciudad: form.ciudad,
      razon_social: form.razon_social,
      nombre_fantasia: form.nombre_fantasia,
      direccion_comercial: form.direccion_comercial,
      nombre_rl: form.nombre_rl,
      email_rl: form.email_rl,
      giro: form.giro,
      tipo_abono: form.tipo_abono,
      tipo_folios: form.tipo_folios,
      chip: form.chip,

      codigo_comercio: form.codigo_comercio,
      observaciones: form.observaciones,

      rut_rl: form.rut_rl,
    };

    try {
      const res = await api.post("/oportunidades", newOpportunity);

      setOpportunities((prev) => [...prev, res.data]);

      setShowModal(false);

      setForm({
        rut: "",
        empresa: "",
        producto: "",
        monto: "",
        vendedor: "",
        telefono: "",
        telefono2: "",
        email: "",
        tipo_ingreso: "",
        stage: stages.length > 0 ? stages[0].id : "",

        nombre: "",
        apellido: "",
        direccion: "",
        comuna: "",
        ciudad: "",
        razon_social: "",
        nombre_fantasia: "",
        direccion_comercial: "",
        nombre_rl: "",
        email_rl: "",
        giro: "",
        tipo_abono: "",
        tipo_folios: "",
        chip: "",

        codigo_comercio: "",
        observaciones: "",
        rut_rl: "",
      });
    } catch (err) {
      console.error("Error creando oportunidad", err);
      alert("Error al crear la oportunidad.");
    }
  };

/* ============================
   RegistrarActividad
   ============================ */
  const registrarActividad = async () => {
    try {
      await api.post(`/oportunidades/${actividadOportunidad}/actividad`, {
        tipo: actividadTipo,
        comentario: actividadComentario,
        usuario: localStorage.getItem("usuario_nombre")
      });

      setShowActividadModal(false);
      setActividadTipo("");
      setActividadComentario("");

      // ⭐ Recargar actividades en la ficha de edición
      if (typeof loadActividades === "function") {
        loadActividades(actividadOportunidad); // ← aquí estaba el error
      }

    } catch (err) {
      console.error("Error registrando actividad:", err);
      alert("No se pudo registrar la actividad.");
    }
  };


/* ============================
   Abrir modal de edición
   ============================ */
const handleEditOpen = (opportunity) => {
  setEditingOpportunity(opportunity);

  setForm({
    rut: opportunity.rut || "",
    empresa: opportunity.empresa || "",
    producto: opportunity.producto || "",
    monto: Number(opportunity.amount || opportunity.monto || 0),
    vendedor: opportunity.vendedor || "",
    telefono: opportunity.telefono || "",
    telefono2: opportunity.telefono2 || "",
    email: opportunity.email || "",
    tipo_ingreso: opportunity.tipo_ingreso || "",
    stage: opportunity.stage,

    nombre: opportunity.nombre || "",
    apellido: opportunity.apellido || "",
    direccion: opportunity.direccion || "",
    comuna: opportunity.comuna || "",
    ciudad: opportunity.ciudad || "",
    razon_social: opportunity.razon_social || "",
    nombre_fantasia: opportunity.nombre_fantasia || "",
    direccion_comercial: opportunity.direccion_comercial || "",
    nombre_rl: opportunity.nombre_rl || "",
    email_rl: opportunity.email_rl || "",
    giro: opportunity.giro || "",
    tipo_abono: opportunity.tipo_abono || "",
    tipo_folios: opportunity.tipo_folios || "",
    chip: opportunity.chip || "",

    codigo_comercio: opportunity.codigo_comercio || "",
    observaciones: opportunity.observaciones || "",
    rut_rl: opportunity.rut_rl || "",
  });

  // ⭐ Cargar actividades de esta oportunidad
  loadActividades(opportunity.id);
};


  /* ============================
   Guardar edición
   ============================ */
  const handleEditSave = async () => {
    if (!editingOpportunity) return;

    const rutNormalizado = normalizarRut(form.rut);

    if (form.rut && !validarRut(rutNormalizado)) {
      alert("El RUT ingresado no es válido.");
      return;
    }

    const updated = {
      rut: rutNormalizado || null,
      empresa: form.empresa,
      producto: form.producto,
      monto: Number(form.monto || 0),
      vendedor: form.vendedor,
      telefono: form.telefono,
      telefono2: form.telefono2,
      email: form.email,
      tipo_ingreso: form.tipo_ingreso,
      stage: Number(form.stage),

      nombre: form.nombre,
      apellido: form.apellido,
      direccion: form.direccion,
      comuna: form.comuna,
      ciudad: form.ciudad,
      razon_social: form.razon_social,
      nombre_fantasia: form.nombre_fantasia,
      direccion_comercial: form.direccion_comercial,
      nombre_rl: form.nombre_rl,
      email_rl: form.email_rl,
      giro: form.giro,
      tipo_abono: form.tipo_abono,
      tipo_folios: form.tipo_folios,
      chip: form.chip,

      codigo_comercio: form.codigo_comercio,
      observaciones: form.observaciones,
      rut_rl: form.rut_rl,
    };

    try {
      const res = await api.put(
        `/oportunidades/${editingOpportunity.id}`,
        updated
      );

      setOpportunities((prev) =>
        prev.map((o) => (o.id === editingOpportunity.id ? res.data : o))
      );

      setEditingOpportunity(null);
    } catch (err) {
      console.error("Error actualizando oportunidad", err);
      alert("Error al actualizar la oportunidad.");
    }
  };

  /* ============================
      loadActividades   
  ============================ */
  
  const loadActividades = async (id) => {
    try {
      const res = await api.get(`/oportunidades/${id}/actividades`);
      setActividades(res.data);
    } catch (err) {
      console.error("Error cargando actividades:", err);
    }
  };
/* ============================
   7. Drag & Drop
   ============================ */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const opportunityId = active.id;
    const newStageId = over.id;

    const stageDestino = stages.find((s) => s.id === newStageId);
    // Si la etapa destino es PERDIDA → abrir modal
    if (stageDestino.name.toLowerCase() === "perdido") {
      setPerdidaOpportunity(opportunityId);
      setShowPerdidaModal(true);
      return; // Detener el movimiento normal
    }

    if (!stageDestino) return;

    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opportunityId ? { ...o, stage: newStageId } : o
      )
    );

    try {
      await api.patch(`/oportunidades/${opportunityId}/stage`, {
        stage: newStageId,
        usuario: localStorage.getItem("usuario_nombre"), // o desde tu contexto
      });

    } catch (err) {
      console.error("Error actualizando etapa de oportunidad", err);
      alert("No se pudo actualizar la etapa en el servidor.");
    }
  };
  
      const registrarPerdida = async () => {
        try {
          await api.patch(`/oportunidades/${perdidaOpportunity}/perder`, {
            motivo,
            comentario,
            usuario: localStorage.getItem("usuario_nombre"),
          });

          // Cerrar modal
          setShowPerdidaModal(false);
          setMotivo("");
          setComentario("");

          // Recargar pipeline
          const res = await api.get("/oportunidades");
          setOpportunities(res.data);

        } catch (err) {
          console.error("Error registrando pérdida:", err);
          alert("No se pudo registrar la pérdida.");
        }
      };

  /* ============================
   8. Ver OS asociada
   ============================ */

  const onViewOS = (osId) => {
    navigate(`/ordenes/${osId}`);
  };

  /* ============================
   9. Métricas del pipeline
   ============================ */

  const filteredOps = useMemo(
    () => applyFilters(opportunities),
    [opportunities, filters, allStages]
  );

  const totalMonto = useMemo(
    () =>
      filteredOps.reduce(
        (acc, o) => acc + Number(o.amount || o.monto || 0),
        0
      ),
    [filteredOps]
  );
  /* ============================
     10. Render
     ============================ */

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Pipeline de Ventas
          </h1>
          <p className="text-sm text-text-secondary">
            Gestión de Oportunidades del CRM Tas Chile
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportPipelineCompleto}
            className="px-4 py-2 rounded-lg bg-green-600 text-white shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-300"
          >
            Exportar Excel
          </button>

          <button
            onClick={() => {
              setShowModal(true);
              setForm({
                rut: "",
                empresa: "",
                producto: "",
                monto: "",
                vendedor: "",
                telefono: "",
                telefono2: "",
                email: "",
                tipo_ingreso: "",
                stage: stages.length > 0 ? stages[0].id : "",

                nombre: "",
                apellido: "",
                direccion: "",
                comuna: "",
                ciudad: "",
                razon_social: "",
                nombre_fantasia: "",
                direccion_comercial: "",
                nombre_rl: "",
                email_rl: "",
                giro: "",
                tipo_abono: "",
                tipo_folios: "",
                chip: "",

                codigo_comercio: "",
                observaciones: "",
                rut_rl: "",
              });
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            + Nueva oportunidad
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-xs text-gray-500">Oportunidades filtradas</p>
          <p className="text-2xl font-bold text-gray-800">
            {filteredOps.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-xs text-gray-500">Monto total filtrado</p>
          <p className="text-2xl font-bold text-gray-800">
            {totalMonto.toLocaleString("es-CL", {
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <p className="text-xs text-gray-500">Etapas activas</p>
          <p className="text-2xl font-bold text-gray-800">
            {stages.filter((s) => s.activo).length}
          </p>
        </div>
      </div>

      {/* Filtros avanzados */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filtros avanzados</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Vendedor</label>
            <input
              type="text"
              value={filters.vendedor}
              onChange={(e) =>
                setFilters({ ...filters, vendedor: e.target.value })
              }
              className="input-base"
              placeholder="Buscar vendedor"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Etapa</label>
            <select
              value={filters.etapa}
              onChange={(e) =>
                setFilters({ ...filters, etapa: e.target.value })
              }
              className="input-base"
            >
              <option value="">Todas</option>
              {allStages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.visible ? "" : "(oculta)"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 col-span-1">
            <label className="text-xs font-medium text-gray-600">RUT / Empresa</label>
            <input
              type="text"
              value={filters.rutEmpresa}
              onChange={(e) =>
                setFilters({ ...filters, rutEmpresa: e.target.value })
              }
              className="input-base"
              placeholder="Ej: 12.345.678-9"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Monto mínimo</label>
            <input
              type="number"
              value={filters.montoMin}
              onChange={(e) =>
                setFilters({ ...filters, montoMin: e.target.value })
              }
              className="input-base"
              placeholder="$0"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Monto máximo</label>
            <input
              type="number"
              value={filters.montoMax}
              onChange={(e) =>
                setFilters({ ...filters, montoMax: e.target.value })
              }
              className="input-base"
              placeholder="$999.999"
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={filters.mostrarOcultas}
              onChange={(e) =>
                setFilters({ ...filters, mostrarOcultas: e.target.checked })
              }
              className="checkbox-base"
            />
            <label className="text-sm text-gray-600">Solo etapas ocultas</label>
          </div>
        </div>
      </div>

      {/* Columnas */}
      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-w-max">
            {stages
              .filter((s) => s.activo)
              .map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  opportunities={filteredOps.filter(
                    (op) => op.stage === stage.id
                  )}
                  onEdit={handleEditOpen}
                  onViewOS={onViewOS}
                  onHistorial={cargarHistorial}
                  setActividadOportunidad={setActividadOportunidad}
                  setShowActividadModal={setShowActividadModal}
                  onCustomer360={onCustomer360}
                />
              ))}
          </div>

        </DndContext>
      </div>
{/* MODAL CREAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg border border-gray-200 
                          max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Nueva oportunidad
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">RUT</label>
                <input
                  type="text"
                  name="rut"
                  value={form.rut}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre Oportunidad</label>
                <input
                  type="text"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Producto</label>
                <select
                  name="producto"
                  value={form.producto}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Monto</label>
                <input
                  type="number"
                  name="monto"
                  value={form.monto}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Vendedor</label>
                <select
                  name="vendedor"
                  value={form.vendedor}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Seleccione vendedor</option>
                  {vendedores.map((v) => (
                    <option key={v.id} value={v.nombre}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Teléfono 2</label>
                <input
                  type="text"
                  name="telefono2"
                  value={form.telefono2}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de ingreso</label>
                <select
                  name="tipo_ingreso"
                  value={form.tipo_ingreso}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Seleccione</option>
                  <option value="web">Web</option>
                  <option value="telefono">Teléfono</option>
                  <option value="presencial">Presencial</option>
                  <option value="referido">Referido</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Etapa</label>
                <select
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Comuna</label>
                <input
                  type="text"
                  name="comuna"
                  value={form.comuna}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Razón Social</label>
                <input
                  type="text"
                  name="razon_social"
                  value={form.razon_social}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre Fantasía</label>
                <input
                  type="text"
                  name="nombre_fantasia"
                  value={form.nombre_fantasia}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
<div>
                <label className="text-sm text-gray-600">Dirección Comercial</label>
                <input
                  type="text"
                  name="direccion_comercial"
                  value={form.direccion_comercial}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre RL</label>
                <input
                  type="text"
                  name="nombre_rl"
                  value={form.nombre_rl}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">RUT Representante Legal</label>
                <input
                  type="text"
                  name="rut_rl"
                  value={form.rut_rl}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  placeholder="Ej: 12.345.678-9"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email RL</label>
                <input
                  type="email"
                  name="email_rl"
                  value={form.email_rl}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Giro</label>
                <input
                  type="text"
                  name="giro"
                  value={form.giro}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de Abono</label>
                <div className="flex flex-col">
                  <select
                    name="tipo_abono"
                    value={form.tipo_abono || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Seleccione tipo de abono</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de Folios</label>
                <select
                  name="tipo_folios"
                  value={form.tipo_folios || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Seleccione tipo de folios</option>
                  <option value="Afectos">Afectos</option>
                  <option value="Exentos">Exentos</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Chip</label>
                <input
                  type="text"
                  name="chip"
                  value={form.chip}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Código de comercio</label>
                <input
                  type="text"
                  name="codigo_comercio"
                  value={form.codigo_comercio}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Crear oportunidad
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editingOpportunity && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg border border-gray-200 
                          max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-4">Editar oportunidad</h2>

            <div className="space-y-4">

              <div>
                <label className="text-sm text-gray-600">RUT</label>
                <input
                  type="text"
                  name="rut"
                  value={form.rut}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre Oportunidad</label>
                <input
                  type="text"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Producto</label>
                <select
                  name="producto"
                  value={form.producto}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Seleccione producto</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Monto</label>
                <input
                  type="number"
                  name="monto"
                  value={form.monto}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Vendedor</label>
                <select
                  name="vendedor"
                  value={form.vendedor}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Seleccione vendedor</option>
                  {vendedores.map((v) => (
                    <option key={v.id} value={v.nombre}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Teléfono 2</label>
                <input
                  type="text"
                  name="telefono2"
                  value={form.telefono2}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de ingreso</label>
                <select
                  name="tipo_ingreso"
                  value={form.tipo_ingreso}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  <option value="">Seleccione</option>
                  <option value="web">Web</option>
                  <option value="telefono">Teléfono</option>
                  <option value="presencial">Presencial</option>
                  <option value="referido">Referido</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Etapa</label>
                <select
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Comuna</label>
                <input
                  type="text"
                  name="comuna"
                  value={form.comuna}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
<div>
                <label className="text-sm text-gray-600">Razón Social</label>
                <input
                  type="text"
                  name="razon_social"
                  value={form.razon_social}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre Fantasía</label>
                <input
                  type="text"
                  name="nombre_fantasia"
                  value={form.nombre_fantasia}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Dirección Comercial</label>
                <input
                  type="text"
                  name="direccion_comercial"
                  value={form.direccion_comercial}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Nombre RL</label>
                <input
                  type="text"
                  name="nombre_rl"
                  value={form.nombre_rl}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">RUT Representante Legal</label>
                <input
                  type="text"
                  name="rut_rl"
                  value={form.rut_rl}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  placeholder="Ej: 12.345.678-9"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email RL</label>
                <input
                  type="email"
                  name="email_rl"
                  value={form.email_rl}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Giro</label>
                <input
                  type="text"
                  name="giro"
                  value={form.giro}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de Abono</label>
                <div className="flex flex-col">
                  <select
                    name="tipo_abono"
                    value={form.tipo_abono || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Seleccione tipo de abono</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600">Tipo de Folios</label>
                <select
                  name="tipo_folios"
                  value={form.tipo_folios || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Seleccione tipo de folios</option>
                  <option value="Afectos">Afectos</option>
                  <option value="Exentos">Exentos</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Chip</label>
                <input
                  type="text"
                  name="chip"
                  value={form.chip}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Código de comercio</label>
                <input
                  type="text"
                  name="codigo_comercio"
                  value={form.codigo_comercio}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Observaciones</label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            {/* ACTIVIDADES */}
            <div className="mt-6">
              <h3 className="text-md font-semibold mb-2">Actividades</h3>

              {actividades.length === 0 ? (
                <p className="text-sm text-gray-500">No hay actividades registradas.</p>
              ) : (
                actividades.map((a) => (
                  <div
                    key={a.id}
                    className="border-b border-gray-200 py-2 text-sm"
                  >
                    <p>
                      <strong>{a.tipo}</strong>
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(a.fecha).toLocaleString("es-CL")}
                    </p>

                    <p className="text-xs text-gray-600">
                      Usuario: {a.usuario}
                    </p>

                    {a.comentario && (
                      <p className="text-sm mt-1">{a.comentario}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingOpportunity(null)}
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
{/* MODAL HISTORIAL */}
      {showHistorialModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Historial de movimientos — ID {historialOportunidad}
            </h2>

            {historial.length === 0 ? (
              <p className="text-sm text-gray-500">Sin movimientos registrados.</p>
            ) : (
              historial.map((h) => (
                <div
                  key={h.id}
                  className="border-b border-gray-200 py-2 text-sm"
                >
                  {/* Etapas */}
                  <p>
                    <strong>{h.etapa_anterior_nombre || "—"}</strong> →{" "}
                    <strong>{h.etapa_nueva_nombre || "—"}</strong>
                  </p>

                  {/* Fecha */}
                  <p className="text-xs text-gray-500">
                    {new Date(h.fecha_movimiento).toLocaleString("es-CL")}
                  </p>

                  {/* Usuario */}
                  <p className="text-xs text-gray-600">
                    Realizado por: {h.realizado_por}
                  </p>

                  {/* Motivo de pérdida (solo si stage_nuevo = 10) */}
                  {h.stage_nuevo === 10 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>Motivo de pérdida:</strong>{" "}
                        {h.motivo_perdida || "No registrado"}
                      </p>

                      {h.comentario_perdida && (
                        <p className="text-sm text-red-600 mt-1">
                          <strong>Comentario:</strong> {h.comentario_perdida}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            <button
              onClick={() => setShowHistorialModal(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL ACTIVIDAD */}
      {showActividadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Registrar actividad</h2>

            <label className="text-sm text-gray-600">Tipo</label>
            <select
              className="w-full border p-2 rounded-lg mt-1"
              value={actividadTipo}
              onChange={(e) => setActividadTipo(e.target.value)}
            >
              <option value="">Seleccione tipo</option>
              <option value="llamada">Llamada</option>
              <option value="reunión">Reunión</option>
              <option value="nota">Nota</option>
              <option value="tarea">Tarea</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>

            <label className="text-sm text-gray-600 mt-3 block">Comentario</label>
            <textarea
              className="w-full border p-2 rounded-lg mt-1"
              rows={3}
              value={actividadComentario}
              onChange={(e) => setActividadComentario(e.target.value)}
            />

            <button
              onClick={registrarActividad}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Guardar actividad
            </button>

            <button
              onClick={() => setShowActividadModal(false)}
              className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* MODAL PERDIDA */}
      {showPerdidaModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl max-h-[90vh] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">Registrar motivo de pérdida</h2>

            <label className="text-sm text-gray-600">Motivo</label>
            <select
              className="w-full border p-2 rounded-lg mt-1"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            >
              <option value="">Seleccione motivo</option>
              <option value="Competencia">Competencia</option>
              <option value="Precio">Precio</option>
              <option value="No responde">No responde</option>
              <option value="No interesado">No interesado</option>
              <option value="No cumple requisitos">No cumple requisitos</option>
              <option value="Error de contacto">Error de contacto</option>
              <option value="Otro">Otro</option>
            </select>

            <label className="text-sm text-gray-600 mt-3 block">Comentario</label>
            <textarea
              className="w-full border p-2 rounded-lg mt-1"
              rows={3}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />

            <button
              onClick={registrarPerdida}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
            >
              Guardar pérdida
            </button>

            <button
              onClick={() => setShowPerdidaModal(false)}
              className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg"
            >
              Cancelar
            </button>

          </div>
        </div>
      )}

      {showCustomer360 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            
            <Customer360 
              rut={customerRut} 
              onClose={() => setShowCustomer360(false)} 
            />

          </div>
        </div>
      )}

    </div>
  );
}








