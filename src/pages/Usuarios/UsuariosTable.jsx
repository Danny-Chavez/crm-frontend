export default function UsuariosTable({ usuarios, onEdit, onDelete, onPassword, puedeEditar }) {
  return (
    <div className="bg-surface rounded-xl shadow-md overflow-hidden font-sans">
      <table className="w-full text-sm text-text-main">

        {/* HEADER */}
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 font-semibold text-left">Nombre</th>
            <th className="p-4 font-semibold text-left">Email</th>
            <th className="p-4 font-semibold text-left">Rol</th>
            <th className="p-4 font-semibold text-left">Estado</th>
            <th className="p-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {usuarios.map((u, index) => (
            <tr
              key={u.id}
              className={`border-t border-border hover:bg-gray-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="p-4">{u.nombre}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">{u.rol}</td>

              {/* Estado */}
              <td className="p-4">
                {u.activo ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </td>

              {/* Acciones */}
              <td className="p-4 text-right space-x-2">

                {/* Solo SuperAdmin puede editar */}
                {puedeEditar && (
                  <button
                    onClick={() => onEdit(u)}
                    className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition"
                  >
                    Editar
                  </button>
                )}

                {/* Solo SuperAdmin puede cambiar contraseña */}
                {puedeEditar && (
                  <button
                    onClick={() => onPassword(u)}
                    className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition"
                  >
                    Cambiar contraseña
                  </button>
                )}

                {/* Solo SuperAdmin puede desactivar */}
                {puedeEditar && (
                  <button
                    onClick={() => onDelete(u.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Desactivar
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



