export default function PipelineModalEdit({
  show,
  form,
  stages,
  vendedores,
  productos,
  actividades,
  handleChange,
  onClose,
  onSave,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg border border-gray-200 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">Editar oportunidad</h2>

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
              <option value="Campaña">Campaña</option>
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

          {/* Nombre */}
          <div>
            <label className="text-sm text-gray-600">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="text-sm text-gray-600">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="text-sm text-gray-600">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Comuna */}
          <div>
            <label className="text-sm text-gray-600">Comuna</label>
            <input
              type="text"
              name="comuna"
              value={form.comuna}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="text-sm text-gray-600">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Razón Social */}
          <div>
            <label className="text-sm text-gray-600">Razón Social</label>
            <input
              type="text"
              name="razon_social"
              value={form.razon_social}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Nombre Fantasía */}
          <div>
            <label className="text-sm text-gray-600">Nombre Fantasía</label>
            <input
              type="text"
              name="nombre_fantasia"
              value={form.nombre_fantasia}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Dirección Comercial */}
          <div>
            <label className="text-sm text-gray-600">Dirección Comercial</label>
            <input
              type="text"
              name="direccion_comercial"
              value={form.direccion_comercial}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Nombre RL */}
          <div>
            <label className="text-sm text-gray-600">Nombre RL</label>
            <input
              type="text"
              name="nombre_rl"
              value={form.nombre_rl}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* RUT RL */}
          <div>
            <label className="text-sm text-gray-600">RUT Representante Legal</label>
            <input
              type="text"
              name="rut_rl"
              value={form.rut_rl}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Ej: 12.345.678-9"
            />
          </div>

          {/* Email RL */}
          <div>
            <label className="text-sm text-gray-600">Email RL</label>
            <input
              type="email"
              name="email_rl"
              value={form.email_rl}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Giro */}
          <div>
            <label className="text-sm text-gray-600">Giro</label>
            <input
              type="text"
              name="giro"
              value={form.giro}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Tipo Abono */}
          <div>
            <label className="text-sm text-gray-600">Tipo de Abono</label>
            <select
              name="tipo_abono"
              value={form.tipo_abono || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione tipo de abono</option>
              <option value="Mensual">Mensual</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          {/* Tipo Folios */}
          <div>
            <label className="text-sm text-gray-600">Tipo de Folios</label>
            <select
              name="tipo_folios"
              value={form.tipo_folios || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione tipo de folios</option>
              <option value="Afectos">Afectos</option>
              <option value="Exentos">Exentos</option>
              <option value="Ambos">Ambos</option>
            </select>
          </div>

          {/* Chip */}
          <div>
            <label className="text-sm text-gray-600">Chip</label>
            <select
              name="chip"
              value={form.chip}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            >
              <option value="">Seleccione chip</option>
              <option value="Movistar">Movistar</option>
              <option value="Claro">Claro</option>
            </select>
          </div>

          {/* Código Comercio */}
          <div>
            <label className="text-sm text-gray-600">Código de comercio</label>
            <input
              type="text"
              name="codigo_comercio"
              value={form.codigo_comercio}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          {/* Observaciones */}
          <div>
            <label className="text-sm text-gray-600">Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
              rows={3}
            />
          </div>

        </div>

        {/* ACTIVIDADES */}
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Actividades</h3>

          {actividades.length === 0 ? (
            <p className="text-sm text-gray-500">No hay actividades registradas.</p>
          ) : (
            actividades.map((a) => (
              <div key={a.id} className="border-b border-gray-200 py-2 text-sm">
                <p><strong>{a.tipo}</strong></p>
                <p className="text-xs text-gray-500">
                  {new Date(a.fecha).toLocaleString("es-CL")}
                </p>
                <p className="text-xs text-gray-600">Usuario: {a.usuario}</p>
                {a.comentario && (
                  <p className="text-sm mt-1">{a.comentario}</p>
                )}
              </div>
            ))
          )}
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
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
}
