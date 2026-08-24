import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { validarRut, normalizarRut } from "../../utils/rut";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import Customer360 from "../../components/Customer360";
import useAuth from "../../auth/useAuth";
import PipelineModalCreate from "./PipelineModalCreate";
import PipelineModalEdit from "./PipelineModalEdit";
import PipelineModalHistorial from "./PipelineModalHistorial";
import PipelineModalActividad from "./PipelineModalActividad";
import PipelineModalPerdida from "./PipelineModalPerdida";
import PipelineMetrics from "./PipelineMetrics";
import PipelineBoard from "./PipelineBoard";


import OpportunityCard from "./PipelineCard";
import StageColumn from "./PipelineColumn";

/* ============================
   3. Componente principal
   ============================ */
export default function Pipeline() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // CUSTOMER 360
  const [showCustomer360, setShowCustomer360] = useState(false);
  const [customerRut, setCustomerRut] = useState(null);

  const onCustomer360 = (rut) => {
    setCustomerRut(rut);
    setShowCustomer360(true);
  };

  // PAGINACIÓN ETAPAS FINALES
  const [opsByStage, setOpsByStage] = useState({});
  const [pages, setPages] = useState({});
  const [totalPages, setTotalPages] = useState({});
  const [finalStages, setFinalStages] = useState([]);

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

  const fetchStageOps = async (stageId, page = 1) => {
    try {
      const res = await api.get(
        `/oportunidades?stage=${stageId}&page=${page}&limit=10`
      );

      const { data, totalPages: tp } = res.data;

      setOpsByStage((prev) => ({
        ...prev,
        [stageId]: data,
      }));

      setPages((prev) => ({
        ...prev,
        [stageId]: page,
      }));

      setTotalPages((prev) => ({
        ...prev,
        [stageId]: tp,
      }));
    } catch (err) {
      console.error("Error cargando etapa paginada:", err);
    }
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

        const finales = all.filter((s) => s.es_final).map((s) => s.id);
        setFinalStages(finales);

        finales.forEach((stageId) => {
          fetchStageOps(stageId, 1);
        });
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

  const [activeId, setActiveId] = useState(null);

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
      const nuevaOportunidad = res.data;

      try {
        await api.post(
          `/oportunidades/${nuevaOportunidad.id}/actividad`,
          {
            tipo: "creación",
            comentario: "Oportunidad creada",
            usuario: user.nombre,
          }
        );
      } catch (err) {
        console.warn("No se pudo registrar actividad:", err);
      }

      setOpportunities((prev) => [...prev, nuevaOportunidad]);

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
    console.log("DATA A ENVIAR:", {
      entidad_tipo: "oportunidad",
      entidad_id: actividadOportunidad,
      tipo: actividadTipo,
      comentario: actividadComentario,
      usuario: localStorage.getItem("usuario_nombre"),
    });

    try {
      await api.post("/actividades", {
        entidad_tipo: "oportunidad",
        entidad_id: actividadOportunidad,
        tipo: actividadTipo,
        comentario: actividadComentario,
        usuario: localStorage.getItem("usuario_nombre"),
      });

      setShowActividadModal(false);
      setActividadTipo("");
      setActividadComentario("");

      if (typeof loadActividades === "function") {
        loadActividades(actividadOportunidad);
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
        prev.map((o) =>
          o.id === editingOpportunity.id ? res.data : o
        )
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

  let newStageId = null;

  // ⭐ Si caemos sobre una columna (droppable)
  if (over.data?.current?.type === "column") {
    newStageId = over.data.current.id;
  } else {
    // ⭐ Si caemos sobre una tarjeta (sortable)
    const targetCard = opportunities.find((o) => o.id === over.id);
    newStageId = targetCard?.stage;
  }

  if (!newStageId) return;

  const stageDestino = stages.find((s) => s.id === newStageId);

  if (stageDestino && stageDestino.name.toLowerCase() === "perdido") {
    setPerdidaOpportunity(opportunityId);
    setShowPerdidaModal(true);
    return;
  }

  try {
    const oldStage = opportunities.find(
      (o) => o.id === opportunityId
    )?.stage;

    // ⭐⭐⭐ MOVEMOS LA TARJETA EN EL FRONT INMEDIATAMENTE (sin esperar al backend)
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opportunityId ? { ...o, stage: newStageId } : o
      )
    );

    // ⭐⭐⭐ AHORA recién actualizamos el backend
    await api.patch(`/oportunidades/${opportunityId}/stage`, {
      stage: newStageId,
      usuario: localStorage.getItem("usuario_nombre"),
    });

    // ⭐ Actualizar paginación si corresponde
    if (finalStages.includes(newStageId)) {
      fetchStageOps(newStageId, pages[newStageId] || 1);
    }

    if (finalStages.includes(oldStage)) {
      fetchStageOps(oldStage, pages[oldStage] || 1);
    }
  } catch (err) {
    console.error("Error actualizando etapa de oportunidad", err);

    if (err.response?.status === 400 && err.response?.data?.detalles) {
      alert(
        "No se puede avanzar:\n\n" +
          err.response.data.detalles.join("\n")
      );
      return;
    }

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

    setShowPerdidaModal(false);
    setMotivo("");
    setComentario("");

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

      <PipelineMetrics
        filteredOps={filteredOps}
        totalMonto={totalMonto}
        stages={stages}
      />

      {/* Filtros avanzados */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Filtros avanzados
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Vendedor
            </label>
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
            <label className="text-xs font-medium text-gray-600">
              Etapa
            </label>
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
            <label className="text-xs font-medium text-gray-600">
              RUT / Empresa
            </label>
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
            <label className="text-xs font-medium text-gray-600">
              Monto mínimo
            </label>
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
            <label className="text-xs font-medium text-gray-600">
              Monto máximo
            </label>
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
                setFilters({
                  ...filters,
                  mostrarOcultas: e.target.checked,
                })
              }
              className="checkbox-base"
            />
            <label className="text-sm text-gray-600">
              Solo etapas ocultas
            </label>
          </div>
        </div>
      </div>

      <PipelineBoard
        stages={stages}
        finalStages={finalStages}
        filteredOps={filteredOps}
        opsByStage={opsByStage}
        pages={pages}
        totalPages={totalPages}
        sensors={sensors}
        activeId={activeId}
        setActiveId={setActiveId}
        handleDragEnd={handleDragEnd}
        applyFilters={applyFilters}
        fetchStageOps={fetchStageOps}
        opportunities={opportunities}
        handleEditOpen={handleEditOpen}
        onViewOS={onViewOS}
        cargarHistorial={cargarHistorial}
        setActividadOportunidad={setActividadOportunidad}
        setShowActividadModal={setShowActividadModal}
        onCustomer360={onCustomer360}
      />

      <PipelineModalCreate
        show={showModal}
        form={form}
        stages={stages}
        vendedores={vendedores}
        productos={productos}
        handleChange={handleChange}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />

      <PipelineModalEdit
        show={!!editingOpportunity}
        form={form}
        stages={stages}
        vendedores={vendedores}
        productos={productos}
        actividades={actividades}
        handleChange={handleChange}
        onClose={() => setEditingOpportunity(null)}
        onSave={handleEditSave}
      />

      <PipelineModalHistorial
        show={showHistorialModal}
        historial={historial}
        historialOportunidad={historialOportunidad}
        onClose={() => setShowHistorialModal(false)}
      />

      <PipelineModalActividad
        show={showActividadModal}
        actividadTipo={actividadTipo}
        actividadComentario={actividadComentario}
        onChangeTipo={setActividadTipo}
        onChangeComentario={setActividadComentario}
        onSave={registrarActividad}
        onClose={() => setShowActividadModal(false)}
      />

      <PipelineModalPerdida
        show={showPerdidaModal}
        motivo={motivo}
        comentario={comentario}
        onChangeMotivo={setMotivo}
        onChangeComentario={setComentario}
        onSave={registrarPerdida}
        onClose={() => setShowPerdidaModal(false)}
      />

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









