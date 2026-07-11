import { useState } from "react";
import { estadosOSService } from "../../services/estados-os.service";

export default function EstadoOSForm({ estado, onClose, onSaved }) {
  const [form, setForm] = useState(
    estado || { nombre: "", descripcion: "" }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (estado) {
      await estadosOSService.update(estado.id, form);
    } else {
      await estadosOSService.create(form);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center font-sans">
      <form
        className="bg-surface p-6 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-primary">
          {estado ? "Editar Estado" : "Crear Estado"}
        </h2>

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Nombre</label>
          <input
            name="nombre"
            placeholder="Nombre"
            className="border border-border p-3 rounded-lg text-sm 
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Descripción</label>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            className="border border-border p-3 rounded-lg text-sm 
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

