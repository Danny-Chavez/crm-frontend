import { useEffect, useState, useRef } from "react";
import useAuth from "../auth/useAuth";
import { configuracionService } from "../services/configuracion.service";
import { Link } from "react-router-dom";

export default function Header({ onOpenPasswordModal }) {
  const { user, logout } = useAuth();
  const [logo, setLogo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    configuracionService.getLogo().then((res) => {
      setLogo(res.data.logo);
    });
  }, []);

  // ⭐ Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.name ||
    user?.nombre ||
    user?.username ||
    user?.email ||
    "Usuario";

  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white 
                       border border-gray-200 rounded-xl shadow-sm mb-6">

      {/* Logo + título */}
      <div className="flex items-center gap-3">
        {logo ? (
          <img src={logo} alt="Logo" className="h-10 object-contain" />
        ) : (
          <span className="text-xl font-bold text-primary">TAS</span>
        )}

        <h1 className="text-lg font-semibold text-gray-700">
          CRM - TAS Chile S.A.
        </h1>
      </div>

      {/* Avatar + menú */}
      <div className="relative" ref={menuRef}>
        <div
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer font-semibold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {initial}
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl p-2 
                          border border-gray-100 z-50">

            <p className="px-3 py-2 text-gray-700 font-medium border-b">
              {displayName}
            </p>

            {/* ⭐ NUEVO: enlace Mi Perfil */}
            <Link
              to="/mi-perfil"
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-gray-700 block"
              onClick={() => setMenuOpen(false)}
            >
              Mi Perfil
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                onOpenPasswordModal();
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-blue-600"
            >
              Cambiar mi contraseña
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

    </header>
  );
}








