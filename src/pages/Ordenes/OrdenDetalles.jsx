import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ordenesService } from "../../services/ordenes.service";

export default function OrdenDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarOrden = async () => {
    try {
      const res = await ordenesService.getById(id);
      setOrden(res.data);
    } catch (err) {
      console.error("Error cargando OS", err);
      alert("No se pudo cargar la orden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrden();
  }, [id]);

  if (loading) return <div className="p-6">Cargando OS...</div>;
  if (!orden) return <div className="p-6">OS no encontrada.</div>;

  return (
    <div className="p-6 font-sans">
      <button
        onClick={() => navigate("/pipeline")}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-4 text-primary">
        Orden de Servicio #{orden.id}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
        <p><strong>Fecha creación:</strong> {orden.fecha_creacion}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>
        <p><strong>Cliente:</strong> {orden.cliente_rut}</p>
        <p><strong>Comercio:</strong> {orden.comercio_id}</p>
        <p><strong>Terminal:</strong> {orden.dispositivo_id}</p>
        <p><strong>Descripción:</strong> {orden.descripcion}</p>
        <p><strong>Resultado:</strong> {orden.resultado}</p>
        <p><strong>Prioridad:</strong> {orden.prioridad}</p>
        <p><strong>Categoría:</strong> {orden.categoria}</p>
        <p><strong>Técnico:</strong> {orden.tecnico}</p>
      </div>
    </div>
  );
}
