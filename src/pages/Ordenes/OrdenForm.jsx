import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

import { ordenesService } from "../../services/ordenes.service";
import { estadosOSService } from "../../services/estados-os.service";
import { tecnicosService } from "../../services/tecnicos.service";
import { historialService } from "../../services/historial.service";
import { adjuntosService } from "../../services/adjuntos.service";

import { validarRut, normalizarRut } from "../../utils/rut";

import OrdenHistorial from "./OrdenHistorial";
import OrdenAdjuntos from "./OrdenAdjuntos";

/* ------------------ CATEGORÍAS HARDCODEADAS ------------------ */
const categoriasHardcode = [
  { id: 1, nombre: "Soporte" },
  { id: 2, nombre: "Instalación" },
  { id: 3, nombre: "Retiro" },
  { id: 4, nombre: "Enrolamiento" },
  { id: 5, nombre: "Baja de servicio" }
];

/* ------------------ FALLAS HARDCODEADAS ------------------ */
const fallasHardcode = [
  "USB Device", "No Imprime", "No Carga", "Batería", "Morosidad",
  "CD con Problema", "Tamper", "Lentitud", "Sobre Consumo",
  "Actualización de Información", "Gestión DTE", "Error en Reportes",
  "Diferencia en Ventas", "Clave Acceso", "Daño Físico", "Se Apaga",
  "No Enciende", "Soporte Documentos", "Conexión", "Soporte Inventario",
  "Cotización Papel", "Salto de Folios", "Pantalla defectuosa",
  "APP Bloqueada", "Sin Folios", "Falla Teclado", "Cambio razón social",
  "Masivo por Movistar", "Masivo por Claro", "Folios Exentos",
  "No corresponde Soporte", "Obsoleto", "Impresión tenue"
];

export default function OrdenForm({
  orden,
  terminal_id,
  cliente_rut,
  onClose,
  onSaved
}) {
  const { user } = useContext(AuthContext);

  const clean = (v) => (v === undefined || v === "" ? null : v);

  const usuarioActual = user?.nombre || user?.email || "Sistema";

  /* ⭐ FORMULARIO */
  const [form, setForm] = useState(() => {
    if (orden) return { ...orden };

    return {
      cliente_rut: cliente_rut || "",
      comercio_id: "",
      estado: "",
      estado_id: "",
      descripcion: "",
      tecnico_id: "",
      prioridad: "",
      sla_respuesta: "",
      sla_resolucion: "",
      categoria: "",
      origen: "",
      costo: "",
      notas_internas: "",
      resultado: "",
      fono_contacto: "",
      falla: "",
      num_serie: "",
      nom_retira: "",
      dir_despacho: "",
      com_despacho: "",
      num_serie_cambio: "",
      os_in: "",
      os_out: "",

      /* ⭐ NUEVOS CAMPOS OS */
      chip: "",
      modelo_dispositivo: "",
      nombre_fantasia: "",
      seguimiento_correo: ""
    };
  });

  const [estados, setEstados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [files, setFiles] = useState([]);

  /* ⭐ CARGAR OS COMPLETA */
  useEffect(() => {
    if (orden) setForm({ ...orden });
  }, [orden]);

  /* ⭐ CARGAR ESTADOS Y TÉCNICOS */
  useEffect(() => {
    const cargarEstados = async () => {
      const res = await estadosOSService.getAll();
      setEstados(res.data);
    };

    const cargarTecnicos = async () => {
      const res = await tecnicosService.getAll();

      const tecnicosNormalizados = res.data.filter(t =>
        t.rol.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "tecnico"
      );

      setTecnicos(tecnicosNormalizados);
    };

    cargarEstados();
    cargarTecnicos();
  }, []);

  /* ⭐ SLA AUTOMÁTICO */
  const calcularSLA = (prioridad) => {
    const reglas = {
      baja: { respuesta: 720, resolucion: 4320 },
      media: { respuesta: 360, resolucion: 720 },
      alta: { respuesta: 180, resolucion: 360 },
      critica: { respuesta: 60, resolucion: 180 },
    };

    return reglas[prioridad.toLowerCase()] || { respuesta: "", resolucion: "" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "estado") {
      const estadoSeleccionado = estados.find((e) => e.nombre === value);

      setForm({
        ...form,
        estado: value,
        estado_id: estadoSeleccionado ? estadoSeleccionado.id : null,
      });

      return;
    }

    if (name === "prioridad") {
      const sla = calcularSLA(value);
      setForm({
        ...form,
        prioridad: value,
        sla_respuesta: sla.respuesta,
        sla_resolucion: sla.resolucion,
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const registrarCambio = async (ordenId, tipo, descripcion) => {
    await historialService.add(ordenId, {
      tipo,
      descripcion,
      usuario: usuarioActual,
      fecha: new Date().toISOString(),
    });
  };

  /* ⭐ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const rutNormalizado = normalizarRut(form.cliente_rut);

    if (!validarRut(rutNormalizado)) {
      alert("El RUT ingresado no es válido");
      return;
    }

    if (!form.comercio_id || form.comercio_id.trim() === "") {
      alert("Debe ingresar el código de comercio");
      return;
    }

    if (!form.estado || form.estado.trim() === "") {
      alert("Debe seleccionar un estado");
      return;
    }

    const payload = {
      cliente_rut: clean(rutNormalizado),
      comercio_id: clean(form.comercio_id),
      dispositivo_id: clean(terminal_id),
      estado: clean(form.estado),

      descripcion: clean(form.descripcion),
      tecnico_id: clean(form.tecnico_id),
      prioridad: clean(form.prioridad),
      sla: clean(form.sla_resolucion),
      categoria: clean(form.categoria),
      resultado: clean(form.resultado),
      origen: clean(form.origen),
      costo: clean(form.costo),
      notas_internas: clean(form.notas_internas),

      actualizado_por: usuarioActual,

      fono_contacto: clean(form.fono_contacto),
      falla: clean(form.falla),
      num_serie: clean(form.num_serie),
      nom_retira: clean(form.nom_retira),
      dir_despacho: clean(form.dir_despacho),
      com_despacho: clean(form.com_despacho),
      num_serie_cambio: clean(form.num_serie_cambio),
      os_in: clean(form.os_in),
      os_out: clean(form.os_out),

      /* ⭐ NUEVOS CAMPOS OS */
      chip: clean(form.chip),
      modelo_dispositivo: clean(form.modelo_dispositivo),
      nombre_fantasia: clean(form.nombre_fantasia),
      seguimiento_correo: clean(form.seguimiento_correo)
    };

    let osId = null;

    /* ⭐ SI ES EDICIÓN */
    if (orden) {
      osId = orden.id;

      if (orden.estado !== form.estado) {
        await registrarCambio(osId, "cambio_estado", `Estado cambiado de "${orden.estado}" a "${form.estado}"`);
      }

      if (orden.tecnico_id !== form.tecnico_id) {
        await registrarCambio(osId, "cambio_tecnico", `Técnico cambiado`);
      }

      if (orden.prioridad !== form.prioridad) {
        await registrarCambio(osId, "cambio_prioridad", `Prioridad cambiada a "${form.prioridad}"`);
      }

      await ordenesService.update(osId, payload);
      await registrarCambio(osId, "actualizacion", "Orden actualizada");

    } else {
      /* ⭐ SI ES NUEVA */
      const res = await ordenesService.create({
        ...payload,
        creado_por: usuarioActual,
        fecha_creacion: new Date().toISOString(),
      });

      osId = res.id;

      await registrarCambio(osId, "creacion", "Orden creada");
      await registrarCambio(osId, "cliente", `Cliente asociado: ${payload.cliente_rut}`);

      if (form.estado) {
        await registrarCambio(osId, "cambio_estado", `Estado inicial: "${form.estado}"`);
      }
    }

    /* ⭐ ADJUNTOS */
    if (files.length > 0) {
      for (const file of files) {
        await adjuntosService.upload(osId, file);
        await registrarCambio(osId, "adjunto", `Archivo adjuntado: ${file.name}`);
      }
    }

    onSaved();
    onClose();
  };

  /* ------------------ JSX DEL FORMULARIO ------------------ */
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center font-sans">
      <form
        className="bg-surface p-6 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-primary">
          {orden ? "Editar OS" : "Crear OS"}
        </h2>

        {/* Cliente RUT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Cliente (RUT)</label>
          <input
            name="cliente_rut"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.cliente_rut}
            onChange={(e) => setForm({ ...form, cliente_rut: e.target.value })}
            placeholder="12.345.678-K"
          />
        </div>

        {/* Código de comercio */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Código de comercio</label>
          <input
            name="comercio_id"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.comercio_id}
            onChange={handleChange}
            placeholder="Ej: 2220000289"
          />
        </div>

        {/* ⭐ FONO CONTACTO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Fono Contacto</label>
          <input
            name="fono_contacto"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.fono_contacto}
            onChange={handleChange}
            placeholder="Ej: +56 9 1234 5678"
          />
        </div>

        {/* ⭐ FALLA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Falla</label>
          <select
            name="falla"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.falla || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione falla</option>
            {fallasHardcode.map((f, i) => (
              <option key={i} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* ⭐ NUM SERIE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Número de Serie</label>
          <input
            name="num_serie"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.num_serie}
            onChange={handleChange}
            placeholder="Ej: SN123456"
          />
        </div>

        {/* ⭐ NOMBRE QUIEN RETIRA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Nombre quien retira</label>
          <input
            name="nom_retira"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.nom_retira}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
          />
        </div>

        {/* ⭐ DIRECCIÓN DESPACHO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Dirección despacho</label>
          <input
            name="dir_despacho"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.dir_despacho}
            onChange={handleChange}
            placeholder="Ej: Av. Siempre Viva 123"
          />
        </div>

        {/* ⭐ COMUNA DESPACHO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Comuna despacho</label>
          <input
            name="com_despacho"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.com_despacho}
            onChange={handleChange}
            placeholder="Ej: Santiago Centro"
          />
        </div>

        {/* ⭐ NUM SERIE CAMBIO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Número de Serie (Cambio)</label>
          <input
            name="num_serie_cambio"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.num_serie_cambio}
            onChange={handleChange}
            placeholder="Ej: SN987654"
          />
        </div>

        {/* ⭐ OS IN */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">OS IN</label>
          <input
            name="os_in"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.os_in}
            onChange={handleChange}
            placeholder="Ej: 12345"
          />
        </div>

        {/* ⭐ OS OUT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">OS OUT</label>
          <input
            name="os_out"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.os_out}
            onChange={handleChange}
            placeholder="Ej: 67890"
          />
        </div>

        {/* ⭐ CHIP */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Chip</label>
          <input
            name="chip"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.chip || ""}
            onChange={handleChange}
            placeholder="Ej: 893720XXXXXXXXXXX"
          />
        </div>

        {/* ⭐ MODELO DISPOSITIVO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Modelo dispositivo</label>
          <select
            name="modelo_dispositivo"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.modelo_dispositivo || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione modelo</option>

            {/* ⭐ HARDCOLEADOS */}
            <option value="Verifone C680">Verifone C680</option>
            <option value="Verifone T650p">Verifone T650p</option>
            <option value="Telpo TPS390">Telpo TPS390</option>
            <option value="Sunmi P3">Sunmi P3</option>
            <option value="PAX S80">PAX S80</option>
            <option value="Android Generico">Android Generico</option>
            <option value="PDV">PDV</option>

          </select>
        </div>

        {/* ⭐ NOMBRE DE FANTASÍA */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Nombre de fantasía</label>
          <input
            name="nombre_fantasia"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.nombre_fantasia || ""}
            onChange={handleChange}
            placeholder="Ej: Minimarket Don Pepe"
          />
        </div>

        {/* ⭐ SEGUIMIENTO CORREO */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Seguimiento correo</label>
          <textarea
            name="seguimiento_correo"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.seguimiento_correo || ""}
            onChange={handleChange}
            placeholder="Notas de seguimiento por correo..."
            rows={3}
          />
        </div>

                {/* Estado OS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Estado</label>
          <select
            name="estado"
            className="border border-border p-3 rounded-lg text-sm 
                      focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.estado || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione un estado</option>
            {estados.map((e) => (
              <option key={e.id} value={e.nombre}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Técnico asignado */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Técnico</label>
          <select
            name="tecnico_id"
            className="border border-border p-3 rounded-lg text-sm 
                      focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.tecnico_id || ""}
            onChange={handleChange}
          >
            <option value="">Asignar técnico</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Prioridad */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Prioridad</label>
          <select
            name="prioridad"
            className="border border-border p-3 rounded-lg text-sm 
                      focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={form.prioridad || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione prioridad</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>

        {/* SLA automáticos */}
        <div className="flex gap-2">
          <input
            name="sla_respuesta"
            placeholder="SLA respuesta (min)"
            className="border border-border p-3 rounded-lg w-full text-sm bg-gray-100"
            value={form.sla_respuesta}
            readOnly
          />
          <input
            name="sla_resolucion"
            placeholder="SLA resolución (min)"
            className="border border-border p-3 rounded-lg w-full text-sm bg-gray-100"
            value={form.sla_resolucion}
            readOnly
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Categoría</label>
          <select
            name="categoria"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.categoria || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione categoría</option>
            {categoriasHardcode.map((c) => (
              <option key={c.id} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Origen */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Origen</label>
          <select
            name="origen"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.origen || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione origen</option>
            <option value="web">Web</option>
            <option value="app">WhatsApp</option>
            <option value="callcenter">Callcenter</option>
            <option value="tecnico">Técnico</option>
            <option value="oficina">Oficina</option>
          </select>
        </div>

        {/* Costo */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Costo</label>
          <input
            name="costo"
            type="number"
            placeholder="Costo asociado"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.costo}
            onChange={handleChange}
          />
        </div>

        {/* Notas internas */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Notas internas</label>
          <textarea
            name="notas_internas"
            placeholder="Notas internas del técnico"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.notas_internas}
            onChange={handleChange}
          />
        </div>

        {/* Resultado técnico */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Resultado técnico</label>
          <textarea
            name="resultado"
            placeholder="Diagnóstico final"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.resultado}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-main">Descripción</label>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            className="border border-border p-3 rounded-lg text-sm"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        {/* Adjuntar archivos */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-main">Adjuntar archivos</label>

          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="border border-border p-3 rounded-lg text-sm bg-white"
          />

          {files.length > 0 && (
            <ul className="text-xs text-text-secondary bg-gray-50 p-3 rounded-lg">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition"
          >
            Guardar
          </button>
        </div>

        {orden && <OrdenHistorial ordenId={orden.id} />}
        {orden && <OrdenAdjuntos ordenId={orden.id} />}
      </form>
    </div>
  );
}
