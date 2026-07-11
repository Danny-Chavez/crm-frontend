export default function EstadosOSTable({ estados, onEdit }) {
  return (
    <div className="bg-surface rounded-xl shadow-md overflow-hidden font-sans">
      <table className="w-full text-sm text-text-main">

        {/* HEADER */}
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-4 font-semibold text-left">Nombre</th>
            <th className="p-4 font-semibold text-left">Descripción</th>
            <th className="p-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {estados.map((e, index) => (
            <tr
              key={e.id}
              className={`border-t border-border hover:bg-gray-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="p-4">{e.nombre}</td>
              <td className="p-4">{e.descripcion}</td>

              <td className="p-4 text-right">
                <button
                  onClick={() => onEdit(e)}
                  className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold transition"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
