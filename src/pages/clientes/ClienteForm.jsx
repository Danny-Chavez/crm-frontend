import { useState, useEffect } from "react";
import api from "../../utils/axios";
import { validarRut, normalizarRut } from "../../utils/rut";

const ClienteForm = ({ cliente, onClose, onSaved }) => {
  const [form, setForm] = useState({
    rut: cliente?.rut || "",
    nombre_empresa: cliente?.nombre_empresa || "",
    telefono: cliente?.telefono || "",
    email: cliente?.email || "",
    vendedor: cliente?.vendedor || "",   // ⭐ usa el nombre del vendedor
    estado: cliente?.estado || "activo",
  });

  const [errorRut, setErrorRut] = useState("");
  const [vendedores, setVendedores] = useState([]);

  /* ============================
     Cargar vendedores desde backend
     ============================ */
  useEffect(() => {
    const cargarVendedores = async () => {
      try {
        const res = await api.get("/api/oportunidades/vendedores");
        setVendedores(res.data);
      } catch (err) {
        console.error("Error cargando vendedores:", err);
      }
    };

    cargarVendedores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "rut") {
      setErrorRut("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rutNormalizado = normalizarRut(form.rut);

    if (!validarRut(rutNormalizado)) {
      setErrorRut("El RUT ingresado no es válido");
      return;
    }

    try {
      const payload = {
        ...form,
        rut: rutNormalizado,
        vendedor: form.vendedor,   // ⭐ envía el nombre del vendedor
      };

      if (cliente) {
        await api.put(`/api/clientes/${cliente.id}`, payload);
      } else {
        await api.post("/api/clientes", payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Error guardando cliente:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6 max-w-xl mx-auto">

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {cliente ? "Editar Cliente" : "Nuevo Cliente"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Sección: Identificación */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Identificación</h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">RUT</label>
            <input
              name="rut"
              placeholder="Ej: 12.345.678-9"
              value={form.rut}
              onChange={handleChange}
              className="input-base"
            />
            {errorRut && (
              <p className="text-red-600 text-xs mt-1">{errorRut}</p>
            )}
          </div>
        </div>

        {/* Sección: Datos de la empresa */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Datos de la empresa</h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs text-gray-600">Nombre empresa</label>
              <input
                name="nombre_empresa"
                placeholder="Ej: Comercial Los Pinos"
                value={form.nombre_empresa}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Teléfono</label>
              <input
                name="telefono"
                placeholder="Ej: +56 9 1234 5678"
                value={form.telefono}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Email</label>
              <input
                name="email"
                placeholder="Ej: contacto@empresa.cl"
                value={form.email}
                onChange={handleChange}
                className="input-base"
              />
            </div>

          </div>
        </div>

        {/* Sección: Gestión */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Gestión</h3>

          <div className="grid grid-cols-2 gap-4">

            {/* ⭐ Select de vendedores */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Vendedor</label>
              <select
                name="vendedor"
                value={form.vendedor || ""}
                onChange={handleChange}
                className="input-base"
              >
                <option value="">Seleccione vendedor</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.nombre}>
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="input-base"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
          >
            Guardar
          </button>

        </div>

      </form>
    </div>
  );
};

export default ClienteForm;



