import useAuth from "../auth/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  // Detectar nombre real del usuario
  const displayName =
    user?.name ||
    user?.nombre ||
    user?.username ||
    user?.email ||
    "Usuario";

  // Inicial dinámica
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white 
                       border border-gray-200 rounded-xl shadow-sm mb-6">

      <h1 className="text-lg font-semibold text-gray-700">
        CRM - TAS Chile S.A. 
      </h1>

      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="relative group">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer font-semibold">
            {initial}
          </div>

          {/* Menú */}
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl p-2 
                          opacity-0 group-hover:opacity-100 transition pointer-events-none 
                          group-hover:pointer-events-auto border border-gray-100">
            <p className="px-3 py-2 text-gray-700 font-medium border-b">
              {displayName}
            </p>

            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}




