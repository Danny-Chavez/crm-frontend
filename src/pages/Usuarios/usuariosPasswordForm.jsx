import { useState } from "react";
import { usuariosService } from "../../services/usuarios.service";

export default function UsuariosPasswordForm({ usuario, onClose, onSaved }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!password || password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      // ⭐ Ruta correcta: usuario cambia su propia contraseña
      await usuariosService.updateMyPassword(password);

      alert("Contraseña actualizada correctamente");
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error actualizando contraseña");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border">

        <h2 className="text-xl font-bold mb-4">
          Cambiar contraseña de {usuario.nombre}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600">Nueva contraseña</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirmar contraseña</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg mt-1"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>

      </div>
    </div>
  );
}
