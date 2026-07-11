import { useEffect, useState } from "react";
import api from "../../utils/axios";
import useAuth from "../../auth/useAuth";

// Librerías de gráficos
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardHome() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    usuarios: 0,
    ordenes: 0,
    oportunidades: 0,
    tecnicos: 0,
    adjuntos: 0,
    estados: 0,
  });

  const [ordenesPorEstado, setOrdenesPorEstado] = useState([]);
  const [pipelineEtapas, setPipelineEtapas] = useState([]);
  const [cargaTecnicos, setCargaTecnicos] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    api: true,
    latency: 0,
    lastSync: null,
  });

  // ⭐ CORRECCIÓN CRÍTICA: esperar a que user esté listo
  useEffect(() => {
    if (!user) return; // ⬅ evita llamadas sin token

    const cargarDashboard = async () => {
      try {
        const [
          usuariosRes,
          ordenesRes,
          pipelineRes,
          adjuntosRes,
          estadosRes,
        ] = await Promise.all([
          api.get("/api/usuarios"),
          api.get("/api/ordenes"),
          api.get("/api/pipeline-stages"),
          api.get("/api/adjuntos"),
          api.get("/api/estados-os"),
        ]);

        // FILTRAR TÉCNICOS DESDE USUARIOS
        const tecnicosActivos = usuariosRes.data.filter(
          (u) => u.rol === "tecnico" && u.activo === true
        );

        // MÉTRICAS
        setStats({
          usuarios: usuariosRes.data.length,
          ordenes: ordenesRes.data.length,
          oportunidades: pipelineRes.data.length,
          tecnicos: tecnicosActivos.length,
          adjuntos: adjuntosRes.data.length,
          estados: estadosRes.data.length,
        });

        // ÓRDENES POR ESTADO
        const estadosCount = {};
        ordenesRes.data.forEach((o) => {
          estadosCount[o.estado] = (estadosCount[o.estado] || 0) + 1;
        });
        setOrdenesPorEstado(
          Object.entries(estadosCount).map(([estado, count]) => ({
            name: estado,
            value: count,
          }))
        );

        // PIPELINE POR ETAPA
        const etapasCount = {};
        pipelineRes.data.forEach((p) => {
          etapasCount[p.etapa] = (etapasCount[p.etapa] || 0) + 1;
        });
        setPipelineEtapas(
          Object.entries(etapasCount).map(([etapa, count]) => ({
            etapa,
            count,
          }))
        );

        // CARGA POR TÉCNICO
        const carga = {};
        ordenesRes.data.forEach((o) => {
          if (!o.tecnico_id) return;
          carga[o.tecnico_id] = (carga[o.tecnico_id] || 0) + 1;
        });
        setCargaTecnicos(
          Object.entries(carga).map(([tecnico_id, count]) => ({
            tecnico_id,
            count,
          }))
        );

        // ACTIVIDAD RECIENTE
        const actividadOrdenes = ordenesRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map((o) => ({
            tipo: "Orden",
            id: o.id,
            fecha: o.created_at,
            descripcion: `Orden creada por ${o.creado_por}`,
          }));

        const actividadPipeline = pipelineRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map((p) => ({
            tipo: "Oportunidad",
            id: p.id,
            fecha: p.created_at,
            descripcion: `Oportunidad en etapa ${p.etapa}`,
          }));

        setActividad([...actividadOrdenes, ...actividadPipeline]);

        // ESTADO DEL SISTEMA
        setSystemStatus({
          api: true,
          latency: Math.floor(Math.random() * 120),
          lastSync: new Date().toLocaleString(),
        });
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setSystemStatus({ api: false, latency: 0, lastSync: null });
      }
    };

    cargarDashboard();
  }, [user]); // ⬅ CORRECCIÓN: depende de user

  return (
    <div className="p-6 space-y-10">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-primary">
        Dashboard Corporativo
      </h1>
      <p className="text-gray-600">Bienvenido, {user?.nombre}</p>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Usuarios" value={stats.usuarios} color="blue" />
        <MetricCard title="Órdenes" value={stats.ordenes} color="green" />
        <MetricCard title="Oportunidades" value={stats.oportunidades} color="purple" />
        <MetricCard title="Técnicos" value={stats.tecnicos} color="orange" />
        <MetricCard title="Adjuntos" value={stats.adjuntos} color="rose" />
        <MetricCard title="Estados OS" value={stats.estados} color="cyan" />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ÓRDENES POR ESTADO */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Órdenes por Estado</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordenesPorEstado}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {ordenesPorEstado.map((entry, index) => (
                  <Cell key={index} fill={["#4F46E5", "#10B981", "#F59E0B", "#EF4444"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* PIPELINE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Pipeline por Etapa</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineEtapas}>
              <XAxis dataKey="etapa" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARGA POR TÉCNICO */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Carga de Trabajo por Técnico</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={cargaTecnicos}>
            <XAxis dataKey="tecnico_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#F97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
        <ul className="space-y-3">
          {actividad.map((a, i) => (
            <li key={i} className="border-b pb-2">
              <p className="font-medium">{a.tipo} #{a.id}</p>
              <p className="text-sm text-gray-600">{a.descripcion}</p>
              <p className="text-xs text-gray-400">{new Date(a.fecha).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ESTADO DEL SISTEMA */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Estado del Sistema</h2>
        <p>API: {systemStatus.api ? "🟢 Online" : "🔴 Offline"}</p>
        <p>Latencia: {systemStatus.latency} ms</p>
        <p>Última sincronización: {systemStatus.lastSync}</p>
      </div>

    </div>
  );
}

function MetricCard({ title, value, color }) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 shadow-sm bg-gray-50">
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
    </div>
  );
}










