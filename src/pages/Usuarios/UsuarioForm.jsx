import { useState } from "react";
import { usuariosService } from "../../services/usuarios.service";

export default function UsuarioForm({ usuario, onClose, onSaved }) {
  const [form, setForm] = useState(
    usuario || {
      nombre: "",
      email: "",
      rol: "",
      password: ""
    }
  );

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validaciones básicas
      if (!form.nombre || !form.email || !form.rol) {
        setError("Completa todos los campos obligatorios");
        return;
      }

      // Crear usuario: password obligatorio
      if (!usuario && !form.password) {
        setError("La contraseña es obligatoria");
        return;
      }

      if (usuario) {
        await usuariosService.update(usuario.id, form);
      } else {
        await usuariosService.create(form);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar usuario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center font-sans">
      <form
        className="bg-surface p-6 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-primary">
          {usuario ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        {/* ERROR */}
        {error && (
          <div className="text-red-600 text-sm font-medium">{error}</div>
        )}

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

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Email</label>
          <input
            name="email"
            placeholder="Email"
            className="border border-border p-3 rounded-lg text-sm 
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Rol */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Rol</label>
          <select
            name="rol"
            className="border border-border p-3 rounded-lg text-sm 
                       focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.rol}
            onChange={handleChange}
          >
            <option value="">Seleccione rol</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Técnico">Técnico</option>
            <option value="Vendedor">Vendedor</option>
          </select>
        </div>

        {/* Contraseña */}
        {!usuario && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="border border-border p-3 rounded-lg text-sm 
                         focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              value={form.password}
              onChange={handleChange}
            />
          </div>
        )}

        {usuario && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-main">
              Nueva contraseña (opcional)
            </label>
            <input
              name="password"
              type="password"
              placeholder="Dejar vacío para no cambiar"
              className="border border-border p-3 rounded-lg text-sm 
                         focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              value={form.password || ""}
              onChange={handleChange}
            />
          </div>
        )}

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


