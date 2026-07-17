import { useState } from "react";
import api from "../../utils/axios";

const ComercioForm = ({ cliente_id, comercio, onClose, onSaved }) => {

  console.log("🟦 FORM recibe cliente_id:", cliente_id);
  console.log("🟦 Comercio seleccionado:", comercio);

  const [form, setForm] = useState({
    comercio_id: comercio?.comercio_id || "",
    nombre_comercio: comercio?.nombre_comercio || "",
    direccion: comercio?.direccion || "",
    comuna: comercio?.comuna || "",
    ciudad: comercio?.ciudad || "",
    estado: comercio?.estado || "activo",

    // ⭐ Nuevo campo: Tipo de abono
    tipo_abono: comercio?.tipo_abono || "Mensual",

    // ⭐ Nuevos campos: fechas
    fecha_abono: comercio?.fecha_abono || "",
    fecha_renovacion: comercio?.fecha_renovacion || "",
  });

  const normalize = (v) => (v === "" ? null : v);

  const calcularRenovacion = (fecha) => {
    if (!fecha) return "";
    const f = new Date(fecha);
    f.setFullYear(f.getFullYear() + 1);
    return f.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ⭐ Si cambia la fecha de abono y el tipo es anual → recalcular renovación
    if (name === "fecha_abono") {
      const nuevaRenovacion =
        form.tipo_abono === "Anual" ? calcularRenovacion(value) : "";
      setForm({ ...form, fecha_abono: value, fecha_renovacion: nuevaRenovacion });
      return;
    }

    // ⭐ Si cambia el tipo de abono → recalcular renovación
    if (name === "tipo_abono") {
      const nuevaRenovacion =
        value === "Anual" && form.fecha_abono
          ? calcularRenovacion(form.fecha_abono)
          : "";
      setForm({ ...form, tipo_abono: value, fecha_renovacion: nuevaRenovacion });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.comercio_id.trim()) {
      alert("Debe ingresar el código de comercio");
      return;
    }

    if (!form.nombre_comercio.trim()) {
      alert("Debe ingresar el nombre del comercio");
      return;
    }

    const payload = {
      cliente_id,
      comercio_id: normalize(form.comercio_id),
      nombre_comercio: normalize(form.nombre_comercio),
      direccion: normalize(form.direccion),
      comuna: normalize(form.comuna),
      ciudad: normalize(form.ciudad),
      estado: normalize(form.estado),

      // ⭐ Campos nuevos
      tipo_abono: normalize(form.tipo_abono),
      fecha_abono: normalize(form.fecha_abono),
      fecha_renovacion: normalize(form.fecha_renovacion),
    };

    console.log("🟥 Payload enviado al backend:", payload);

    try {
      if (comercio) {
        await api.put(`/comercios/${comercio.id}`, payload);
      } else {
        await api.post("/comercios", payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("❌ Error guardando comercio:", err.response?.data || err);
      alert("Error al guardar comercio");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6 max-w-xl mx-auto">

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {comercio ? "Editar Comercio" : "Nuevo Comercio"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección: Datos del comercio */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Datos del comercio</h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Código de comercio</label>
              <input
                name="comercio_id"
                placeholder="Ej: 2220000289"
                value={form.comercio_id}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Nombre del comercio</label>
              <input
                name="nombre_comercio"
                placeholder="Ej: Minimarket Los Pinos"
                value={form.nombre_comercio}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Dirección</h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Dirección</label>
              <input
                name="direccion"
                placeholder="Ej: Av. Siempre Viva 123"
                value={form.direccion}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Comuna</label>
              <input
                name="comuna"
                placeholder="Ej: Cerrillos"
                value={form.comuna}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-gray-600">Ciudad</label>
              <input
                name="ciudad"
                placeholder="Ej: Santiago"
                value={form.ciudad}
                onChange={handleChange}
                className="input-base"
              />
            </div>

          </div>
        </div>

        {/* Estado */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Estado</h3>

          <div className="flex flex-col gap-1 w-40">
            <label className="text-xs text-gray-600">Estado del comercio</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="input-base"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Tipo de abono */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Tipo de abono</h3>

          <div className="flex flex-col gap-1 w-40">
            <label className="text-xs text-gray-600">Tipo de abono</label>

            <select
              name="tipo_abono"
              value={form.tipo_abono}
              onChange={handleChange}
              className="input-base"
            >
              <option value="Mensual">Mensual</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        </div>

        {/* ⭐ Fecha de abono */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Fecha de abono</h3>

          <div className="flex flex-col gap-1 w-40">
            <label className="text-xs text-gray-600">Fecha de abono</label>
            <input
              type="date"
              name="fecha_abono"
              value={form.fecha_abono}
              onChange={handleChange}
              className="input-base"
            />
          </div>

          {/* ⭐ Mostrar renovación automática */}
          {form.tipo_abono === "Anual" && form.fecha_abono && (
            <p className="text-xs text-gray-500">
              Renovación automática: <strong>{form.fecha_renovacion}</strong>
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
          >
            Guardar
          </button>

        </div>

      </form>
    </div>
  );
};

export default ComercioForm;







