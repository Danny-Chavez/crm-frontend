export default function EstadosOSTable({ estados, onEdit, onDelete }) {
  return (
    <div className="bg-surface rounded-xl shadow-md overflow-hidden font-sans">
      <table className="w-full text-sm text-text-main">

        {/* HEADER */}
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 font-semibold text-left">Nombre</th>
            <th className="p-4 font-semibold text-left">Descripción</th>
            <th className="p-4 font-semibold text-left">Final</th>
            <th className="p-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {estados.map((e, index) => {
            const esFinal = e.es_final === true;

            return (
              <tr
                key={e.id}
                className={`border-t border-border hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* Nombre */}
                <td className="p-4">{e.nombre}</td>

                {/* Descripción */}
                <td className="p-4">{e.descripcion}</td>

                {/* Estado final */}
                <td className="p-4">
                  {esFinal ? (
                    <span
                      className="text-red-600 font-bold flex items-center gap-1"
                      title="Este estado es final y bloquea ediciones de OS"
                    >
                      🔒 Final
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Acciones */}
                <td className="p-4 text-right flex gap-2 justify-end">

                  {/* EDITAR */}
                  <button
                    onClick={() => !esFinal && onEdit(e)}
                    disabled={esFinal}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition
                      ${esFinal
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-dark text-white"
                      }`}
                  >
                    Editar
                  </button>

                  {/* ELIMINAR */}
                  <button
                    onClick={() => !esFinal && onDelete(e)}
                    disabled={esFinal}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition
                      ${esFinal
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                  >
                    Eliminar
                  </button>

                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}



