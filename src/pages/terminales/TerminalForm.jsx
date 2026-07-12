import { useState } from "react";
import api from "../../utils/axios";

const TerminalForm = ({ comercio_id, terminal, onClose, onSaved }) => {
  const [form, setForm] = useState({
    tid: terminal?.tid || "",
    tipo: terminal?.tipo || "",
    modelo: terminal?.modelo || "",
    serie: terminal?.serie || "",
    marca: terminal?.marca || "",
    version: terminal?.version || "",
    simcard: terminal?.simcard || "",
    estado: terminal?.estado || "operativo",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (terminal) {
        await api.put(`/terminales/${terminal.id}`, {
          comercio_id,
          ...form,
        });
      } else {
        await api.post("/terminales", {
          comercio_id,
          ...form,
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Error guardando terminal:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6 max-w-xl mx-auto">

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {terminal ? "Editar Terminal" : "Nuevo Terminal"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección: Identificación */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Identificación</h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">TID</label>
              <input
                name="tid"
                placeholder="Ej: 12345678"
                value={form.tid}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Tipo</label>
              <input
                name="tipo"
                placeholder="POS, Router, etc."
                value={form.tipo}
                onChange={handleChange}
                className="input-base"
              />
            </div>

          </div>
        </div>

        {/* Sección: Hardware */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Hardware</h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Modelo</label>
              <input
                name="modelo"
                placeholder="Ej: VX520"
                value={form.modelo}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Número de serie</label>
              <input
                name="serie"
                placeholder="Ej: SN123456"
                value={form.serie}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Marca</label>
              <input
                name="marca"
                placeholder="Ej: Ingenico"
                value={form.marca}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Versión</label>
              <input
                name="version"
                placeholder="Ej: 1.0.3"
                value={form.version}
                onChange={handleChange}
                className="input-base"
              />
            </div>

          </div>
        </div>

        {/* Sección: Conectividad */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Conectividad</h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">SIM Card</label>
            <input
              name="simcard"
              placeholder="Ej: 987654321"
              value={form.simcard}
              onChange={handleChange}
              className="input-base"
            />
          </div>
        </div>

        {/* Sección: Estado */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Estado</h3>

          <div className="flex flex-col gap-1 w-40">
            <label className="text-xs text-gray-600">Estado del terminal</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="input-base"
            >
              <option value="operativo">Operativo</option>
              <option value="fallado">Fallado</option>
              <option value="retirado">Retirado</option>
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

export default TerminalForm;

