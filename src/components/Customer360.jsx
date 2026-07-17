import { useEffect, useState } from "react";
import api from "../utils/axios";

export default function Customer360({ rut, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info360, abonosVencer] = await Promise.all([
          api.get(`/clientes/${rut}/360`),
          api.get(`/clientes/${rut}/abonos-vencer`)
        ]);

        setData({
          ...info360.data,
          abonos_vencer: abonosVencer.data
        });
      } catch (err) {
        console.error("Error cargando Customer360:", err);
      }
    };

    fetchData();
  }, [rut]);

  if (!data) return <p>Cargando ficha del cliente...</p>;

  // ⭐ Función para calcular alertas
  const getAbonoAlert = (fechaRenovacion) => {
    if (!fechaRenovacion) return null;

    const hoy = new Date();
    const renov = new Date(fechaRenovacion);
    const diff = renov - hoy;
    const dias = diff / (1000 * 60 * 60 * 24);

    if (dias < 0) {
      return {
        tipo: "vencido",
        mensaje: "⚠ El abono anual está vencido."
      };
    }

    if (dias <= 30) {
      return {
        tipo: "pronto",
        mensaje: `⚠ El abono anual vence en ${Math.ceil(dias)} días.`
      };
    }

    return null;
  };

  // ⭐ Exportar abonos por vencer a CSV (compatible con Vercel)
  const exportarAbonosExcel = () => {
    if (!data.abonos_vencer || data.abonos_vencer.length === 0) {
      alert("No hay abonos por vencer para exportar.");
      return;
    }

    const encabezados = Object.keys(data.abonos_vencer[0]);

    const filas = data.abonos_vencer.map((a) =>
      encabezados.map((key) => a[key] ?? "—")
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
    a.download = `abonos_por_vencer_${rut}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">

      <h2 className="text-2xl font-bold mb-4">
        Customer 360 — {data.cliente.nombre_empresa}
      </h2>

      {/* DATOS DEL CLIENTE */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Datos del cliente</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>RUT:</strong> {data.cliente.rut}</p>
          <p><strong>Empresa:</strong> {data.cliente.nombre_empresa}</p>
          <p><strong>Email:</strong> {data.cliente.email}</p>
          <p><strong>Teléfono:</strong> {data.cliente.telefono}</p>
          <p><strong>Vendedor:</strong> {data.cliente.vendedor}</p>
          <p><strong>Estado:</strong> {data.cliente.estado}</p>
        </div>
      </section>

      {/* ⭐ SECCIÓN: ABONOS POR VENCER */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-red-600">
          Abonos por vencer (≤ 30 días)
        </h3>

        {data.abonos_vencer?.length === 0 ? (
          <p className="text-sm text-gray-500">No hay abonos próximos a vencer.</p>
        ) : (
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="p-2 text-left">Comercio</th>
                <th className="p-2 text-left">Fecha abono</th>
                <th className="p-2 text-left">Renovación</th>
                <th className="p-2 text-left">Días restantes</th>
              </tr>
            </thead>

            <tbody>
              {data.abonos_vencer.map((a, i) => {
                const dias = Math.ceil(
                  (new Date(a.fecha_renovacion) - new Date()) /
                  (1000 * 60 * 60 * 24)
                );

                return (
                  <tr
                    key={a.comercio_id}
                    className={`border-t border-gray-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-2 font-semibold">{a.nombre_comercio}</td>
                    <td className="p-2">{a.fecha_abono}</td>
                    <td className="p-2 text-red-600 font-bold">{a.fecha_renovacion}</td>
                    <td className="p-2">
                      {dias <= 0 ? (
                        <span className="text-red-700 font-bold">Vencido</span>
                      ) : (
                        <span className="text-red-600 font-semibold">{dias} días</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Botón exportar */}
        <button
          onClick={exportarAbonosExcel}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          Exportar abonos a Excel
        </button>
      </section>

      {/* ⭐ COMERCIOS DEL CLIENTE */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Comercios del cliente</h3>

        {data.comercios?.length === 0 ? (
          <p className="text-sm text-gray-500">Este cliente no tiene comercios registrados.</p>
        ) : (
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-2 text-left">Comercio ID</th>
                <th className="p-2 text-left">Nombre Fantasía</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Tipo de abono</th>
                <th className="p-2 text-left">Fecha abono</th>
                <th className="p-2 text-left">Renovación</th>
                <th className="p-2 text-left">Alerta</th>
                <th className="p-2 text-left">Dirección</th>
                <th className="p-2 text-left">Comuna</th>
              </tr>
            </thead>

            <tbody>
              {data.comercios.map((c, i) => {
                const alerta = getAbonoAlert(c.fecha_renovacion);

                return (
                  <tr
                    key={c.id}
                    className={`border-t border-gray-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-2 font-semibold text-blue-600">{c.comercio_id}</td>
                    <td className="p-2">{c.nombre_fantasia || "—"}</td>

                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          c.estado === "Activo"
                            ? "bg-green-100 text-green-700"
                            : c.estado === "Suspendido"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {c.estado || "Sin estado"}
                      </span>
                    </td>

                    <td className="p-2 font-medium">{c.tipo_abono || "—"}</td>
                    <td className="p-2">{c.fecha_abono || "—"}</td>
                    <td className="p-2">{c.fecha_renovacion || "—"}</td>

                    <td className="p-2">
                      {alerta ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            alerta.tipo === "vencido"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {alerta.mensaje}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="p-2">{c.direccion || "—"}</td>
                    <td className="p-2">{c.comuna || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* OPORTUNIDADES */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Oportunidades</h3>
        {data.oportunidades.map((op) => (
          <div key={op.id} className="border-b py-2 text-sm">
            <p><strong>{op.empresa}</strong></p>
            <p>Monto: {op.amount}</p>
            <p>Etapa: {op.stage}</p>
          </div>
        ))}
      </section>

      {/* ACTIVIDADES */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Actividades</h3>
        {data.actividades.map((a) => (
          <div key={a.id} className="border-b py-2 text-sm">
            <p><strong>{a.tipo}</strong> — {a.empresa}</p>
            <p>{new Date(a.fecha).toLocaleString("es-CL")}</p>
            <p>{a.comentario}</p>
          </div>
        ))}
      </section>

      {/* HISTORIAL */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Historial</h3>
        {data.historial.map((h) => (
          <div key={h.id} className="border-b py-2 text-sm">
            <p><strong>{h.accion}</strong> — {h.empresa}</p>
            <p>{new Date(h.fecha_movimiento).toLocaleString("es-CL")}</p>
          </div>
        ))}
      </section>

      {/* OS */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Órdenes de servicio</h3>
        {data.os.map((o) => (
          <div key={o.id} className="border-b py-2 text-sm">
            <p><strong>OS #{o.id}</strong></p>
            <p>Estado: {o.estado}</p>
            <p>Fecha: {new Date(o.fecha_creacion).toLocaleDateString("es-CL")}</p>
          </div>
        ))}
      </section>

      <button
        onClick={onClose}
        className="mt-4 bg-gray-300 px-4 py-2 rounded-lg"
      >
        Cerrar
      </button>

    </div>
  );
}








