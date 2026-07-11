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
  });

  const normalize = (v) => (v === "" ? null : v);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⭐ Validaciones obligatorias
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
    };

    console.log("🟥 Payload enviado al backend:", payload);

    try {
      if (comercio) {
        await api.put(`/api/comercios/${comercio.id}`, payload);
      } else {
        await api.post("/api/comercios", payload);
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

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección: Datos del comercio */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Datos del comercio</h3>

          <div className="grid grid-cols-2 gap-4">

            {/* Código de comercio */}
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

            {/* Nombre del comercio */}
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

        {/* Sección: Dirección */}
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

        {/* Sección: Estado */}
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





