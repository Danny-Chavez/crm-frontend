import { useEffect, useState, useContext } from "react";
import { usuariosService } from "../../services/usuarios.service";
import UsuariosTable from "./UsuariosTable";
import UsuarioForm from "./UsuarioForm";
import UsuariosPasswordForm from "./UsuariosPasswordForm";
import { AuthContext } from "../../auth/AuthContext";

export default function UsuariosPage() {
  const { user } = useContext(AuthContext);

  console.debug("LIFECYCLE: UsuariosPage render", { user });

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [error, setError] = useState(null);

  // Nuevo: modal para cambiar contraseña
  const [passwordModal, setPasswordModal] = useState(false);
  const [usuarioPassword, setUsuarioPassword] = useState(null);

  const isAllowed = ["SuperAdmin", "Admin", "Supervisor"].includes(user?.rol);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      console.debug("DEBUG_UI: llamando usuariosService.getAll()");
      const res = await usuariosService.getAll();
      console.debug("DEBUG_UI: usuarios response", res.data);
      setUsuarios(res.data);
    } catch (err) {
      console.error("DEBUG_UI: usuarios error", err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  window.testGetUsuarios = async () => {
    try {
      console.debug("WINDOW TEST: llamando usuariosService.getAll()");
      const res = await usuariosService.getAll();
      console.debug("WINDOW TEST: response", res.data);
    } catch (e) {
      console.error("WINDOW TEST: error", e);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!isAllowed) {
      setLoading(false);
      return;
    }
    cargarUsuarios();
  }, [user]);

  const abrirCrear = () => {
    setUsuarioEdit(null);
    setModalOpen(true);
  };

  const abrirEditar = (usuario) => {
    setUsuarioEdit(usuario);
    setModalOpen(true);
  };

  const abrirPassword = (usuario) => {
    setUsuarioPassword(usuario);
    setPasswordModal(true);
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Desactivar usuario?")) return;
    try {
      await usuariosService.delete(id);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al desactivar usuario");
    }
  };

  if (!user) {
    return <div className="text-text-secondary">Cargando sesión...</div>;
  }

  if (!isAllowed) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        No tienes permisos para ver este módulo.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* ENCABEZADO CORPORATIVO */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Usuarios</h1>
          <p className="text-sm text-text-secondary">
            Gestión de usuarios del CRM Tas Chile
          </p>
        </div>

        {user.rol === "SuperAdmin" && (
          <button
            onClick={abrirCrear}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
          >
            Crear Usuario
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* TABLA */}
      {loading ? (
        <div className="text-text-secondary">Cargando...</div>
      ) : (
        <UsuariosTable
          usuarios={usuarios}
          onEdit={abrirEditar}
          onDelete={eliminarUsuario}
          onPassword={abrirPassword}
          puedeEditar={user.rol === "SuperAdmin"}
        />
      )}

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <UsuarioForm
          usuario={usuarioEdit}
          onClose={() => setModalOpen(false)}
          onSaved={cargarUsuarios}
        />
      )}

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {passwordModal && (
        <UsuariosPasswordForm
          usuario={usuarioPassword}
          onClose={() => setPasswordModal(false)}
          onSaved={cargarUsuarios}
        />
      )}
    </div>
  );
}





