export default function PipelineModalPerdida({
  show,
  motivo,
  comentario,
  onChangeMotivo,
  onChangeComentario,
  onSave,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-4">
          Registrar motivo de pérdida
        </h2>

        {/* Motivo */}
        <label className="text-sm text-gray-600">Motivo</label>
        <select
          className="w-full border p-2 rounded-lg mt-1"
          value={motivo}
          onChange={(e) => onChangeMotivo(e.target.value)}
        >
          <option value="">Seleccione motivo</option>
          <option value="Competencia">Competencia</option>
          <option value="Precio">Precio</option>
          <option value="No responde">No responde</option>
          <option value="No interesado">No interesado</option>
          <option value="No cumple requisitos">No cumple requisitos</option>
          <option value="Error de contacto">Error de contacto</option>
          <option value="Otro">Otro</option>
        </select>

        {/* Comentario */}
        <label className="text-sm text-gray-600 mt-3 block">
          Comentario
        </label>
        <textarea
          className="w-full border p-2 rounded-lg mt-1"
          rows={3}
          value={comentario}
          onChange={(e) => onChangeComentario(e.target.value)}
        />

        {/* Botones */}
        <button
          onClick={onSave}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
        >
          Guardar pérdida
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg"
        >
          Cancelar
        </button>

      </div>
    </div>
  );
}
