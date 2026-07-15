import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useOutletContext } from "react-router-dom";

export default function MiPerfilPage() {
  const { user } = useContext(AuthContext);

  // ⭐ Obtenemos la función desde el Outlet
  const { onOpenPasswordModal } = useOutletContext();

  if (!user) {
    return (
      <div className="text-text-secondary">
        Cargando información del usuario...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto font-sans">

      <h1 className="text-2xl font-bold text-primary mb-4">
        Mi Perfil
      </h1>

      <p className="text-sm text-text-secondary mb-6">
        Información personal del usuario en el CRM Tas Chile.
      </p>

      <div className="space-y-4">

        <div>
          <label className="text-gray-600 text-sm">Nombre</label>
          <div className="p-3 border rounded-lg bg-gray-50">
            {user.nombre || user.name || "—"}
          </div>
        </div>

        <div>
          <label className="text-gray-600 text-sm">Email</label>
          <div className="p-3 border rounded-lg bg-gray-50">
            {user.email}
          </div>
        </div>

        <div>
          <label className="text-gray-600 text-sm">Rol</label>
          <div className="p-3 border rounded-lg bg-gray-50 capitalize">
            {user.rol}
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onOpenPasswordModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
        >
          Cambiar mi contraseña
        </button>
      </div>

    </div>
  );
}

