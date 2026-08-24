export default function PipelineModalActividad({
  show,
  actividadTipo,
  actividadComentario,
  onChangeTipo,
  onChangeComentario,
  onSave,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Registrar actividad
        </h2>

        {/* Tipo */}
        <label className="text-sm text-gray-600">Tipo</label>
        <select
          className="w-full border p-2 rounded-lg mt-1"
          value={actividadTipo}
          onChange={(e) => onChangeTipo(e.target.value)}
        >
          <option value="">Seleccione tipo</option>
          <option value="llamada">Llamada</option>
          <option value="reunión">Reunión</option>
          <option value="nota">Nota</option>
          <option value="tarea">Tarea</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>

        {/* Comentario */}
        <label className="text-sm text-gray-600 mt-3 block">
          Comentario
        </label>
        <textarea
          className="w-full border p-2 rounded-lg mt-1"
          rows={3}
          value={actividadComentario}
          onChange={(e) => onChangeComentario(e.target.value)}
        />

        {/* Botones */}
        <button
          onClick={onSave}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Guardar actividad
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
