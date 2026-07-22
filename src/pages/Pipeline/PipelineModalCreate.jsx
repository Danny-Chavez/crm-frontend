export default function PipelineModalCreate({
  show,
  form,
  stages,
  vendedores,
  productos,
  handleChange,
  onClose,
  onCreate,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg border border-gray-200 
                      max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Nueva oportunidad
        </h2>

        <div className="space-y-4">

          {/* RUT */}
          <div>
            <label className="text-sm text-gray-600">RUT</label>
            <input
              type="text"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="text-sm text-gray-600">Nombre Oportunidad</label>
            <input
              type="text"
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Producto */}
          <div>
            <label className="text-sm text-gray-600">Producto</label>
            <select
              name="producto"
              value={form.producto}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="">Seleccione producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="text-sm text-gray-600">Monto</label>
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Vendedor */}
          <div>
            <label className="text-sm text-gray-600">Vendedor</label>
            <select
              name="vendedor"
              value={form.vendedor}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="">Seleccione vendedor</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.nombre}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Teléfonos */}
          <div>
            <label className="text-sm text-gray-600">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Teléfono 2</label>
            <input
              type="text"
              name="telefono2"
              value={form.telefono2}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Tipo ingreso */}
          <div>
            <label className="text-sm text-gray-600">Tipo de ingreso</label>
            <select
              name="tipo_ingreso"
              value={form.tipo_ingreso}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="">Seleccione</option>
              <option value="web">Web</option>
              <option value="telefono">Teléfono</option>
              <option value="presencial">Presencial</option>
              <option value="referido">Referido</option>
            </select>
          </div>

          {/* Etapa */}
          <div>
            <label className="text-sm text-gray-600">Etapa</label>
            <select
              name="stage"
              value={form.stage}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campos adicionales */}
          {/* Aquí puedes seguir agregando los demás campos tal como los tienes */}

        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Crear oportunidad
          </button>
        </div>

      </div>
    </div>
  );
}
