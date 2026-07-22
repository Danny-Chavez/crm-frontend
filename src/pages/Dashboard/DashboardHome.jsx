import { useEffect, useState } from "react";
import api from "../../utils/axios";
import useAuth from "../../auth/useAuth";
import { Link } from "react-router-dom";   // ⭐ IMPORTANTE

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
  Legend,
} from "recharts";

import {
  FaUsers,
  FaTools,
  FaChartLine,
  FaUserCog,
  FaFolderOpen,
  FaExclamationTriangle,
  FaPlusCircle,
  FaStore,
} from "react-icons/fa";

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

  useEffect(() => {
    if (!user) return;

    const cargarDashboard = async () => {
      try {
        const [
          usuariosRes,
          ordenesRes,
          pipelineRes,
          adjuntosRes,
          etapasRes,
          tecnicosRes,
        ] = await Promise.all([
          api.get("/usuarios"),
          api.get("/ordenes"),
          api.get("/pipeline"),
          api.get("/adjuntos"),
          api.get("/pipeline-stages"),
          api.get("/tecnicos"),
        ]);

        const cantidadTecnicos = tecnicosRes.data.length;

        setStats({
          usuarios: usuariosRes.data.length,
          ordenes: ordenesRes.data.length,
          oportunidades: pipelineRes.data.length,
          tecnicos: cantidadTecnicos,
          adjuntos: adjuntosRes.data.length,
          estados: etapasRes.data.length,
        });

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

        const etapasCount = {};
        pipelineRes.data.forEach((p) => {
          const etapaObj = etapasRes.data.find((e) => e.id === p.stage);
          const nombreEtapa = etapaObj ? etapaObj.nombre : "Sin etapa";
          const colorEtapa = etapaObj ? etapaObj.color : "#999999";

          if (!etapasCount[nombreEtapa]) {
            etapasCount[nombreEtapa] = {
              etapa: nombreEtapa,
              count: 0,
              color: colorEtapa,
            };
          }

          etapasCount[nombreEtapa].count += 1;
        });

        setPipelineEtapas(Object.values(etapasCount));

        const palette = [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
          "#14B8A6",
          "#F97316",
        ];

        const carga = {};

        ordenesRes.data.forEach((o) => {
          if (!o.tecnico_id) return;

          const tecnico = tecnicosRes.data.find((t) => t.id === o.tecnico_id);
          const nombreTecnico = tecnico ? tecnico.nombre : `Técnico ${o.tecnico_id}`;

          if (!carga[nombreTecnico]) {
            const index = Object.keys(carga).length;
            carga[nombreTecnico] = {
              tecnico: nombreTecnico,
              count: 0,
              color: palette[index % palette.length],
            };
          }

          carga[nombreTecnico].count += 1;
        });

        setCargaTecnicos(Object.values(carga));

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
          .map((p) => {
            const etapaObj = etapasRes.data.find((e) => e.id === p.stage);
            return {
              tipo: "Oportunidad",
              id: p.id,
              fecha: p.created_at,
              descripcion: `Oportunidad en etapa ${
                etapaObj ? etapaObj.nombre : "Sin etapa"
              }`,
            };
          });

        setActividad([...actividadOrdenes, ...actividadPipeline]);

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
  }, [user]);

  return (
    <div className="p-6 space-y-10">

      <div>
        <h1 className="text-4xl font-bold text-primary">Dashboard Corporativo</h1>
        <p className="text-gray-600 text-lg">Bienvenido, {user?.nombre}</p>
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Usuarios" value={stats.usuarios} icon={FaUsers} color="blue" />
        <MetricCard title="Órdenes" value={stats.ordenes} icon={FaTools} color="green" />
        <MetricCard title="Oportunidades" value={stats.oportunidades} icon={FaChartLine} color="purple" />
        <MetricCard title="Técnicos" value={stats.tecnicos} icon={FaUserCog} color="orange" />
        <MetricCard title="Adjuntos" value={stats.adjuntos} icon={FaFolderOpen} color="rose" />
        <MetricCard title="Estados OS" value={stats.estados} icon={FaExclamationTriangle} color="cyan" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <ChartCard title="Órdenes por Estado">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordenesPorEstado}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {ordenesPorEstado.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={[
                      "#4F46E5",
                      "#10B981",
                      "#F59E0B",
                      "#EF4444",
                      "#3B82F6",
                      "#14B8A6",
                    ][index % 6]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name, props) => [`${value} órdenes`, props.payload.name]}
              />

              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pipeline por Etapa">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineEtapas} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="etapa" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} oportunidades`} />

              <Bar dataKey="count">
                {pipelineEtapas.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Carga de Trabajo por Técnico">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cargaTecnicos}>
              <XAxis dataKey="tecnico" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} órdenes`} />
              <Bar dataKey="count">
                {cargaTecnicos.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Actividad Reciente">
          <ul className="space-y-3">
            {actividad.map((a, i) => (
              <li key={i} className="border-b pb-2">
                <p className="font-medium">{a.tipo} #{a.id}</p>
                <p className="text-sm text-gray-600">{a.descripcion}</p>
                <p className="text-xs text-gray-400">{new Date(a.fecha).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Estado del Sistema">
          <p>API: {systemStatus.api ? "🟢 Online" : "🔴 Offline"}</p>
          <p>Latencia: {systemStatus.latency} ms</p>
          <p>Última sincronización: {systemStatus.lastSync}</p>
        </ChartCard>

      </div>

    </div>
  );
}

/* COMPONENTES PRO */

function MetricCard({ title, value, icon: Icon, color }) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 shadow-sm bg-white flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <QuickButton title="Nueva OS" icon={FaPlusCircle} to="/ordenes?nueva=1" />
      <QuickButton title="Nuevo Cliente" icon={FaUsers} to="/clientes?nuevo=1" />
      <QuickButton title="Pipeline" icon={FaChartLine} to="/pipeline" />
      <QuickButton title="Clientes" icon={FaStore} to="/clientes" />
    </div>
  );
}

function QuickButton({ title, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="p-4 bg-primary text-white rounded-xl shadow flex items-center gap-3 hover:bg-primary-dark transition"
    >
      <Icon size={22} />
      <span className="font-medium">{title}</span>
    </Link>
  );
}




















