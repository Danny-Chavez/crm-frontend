import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const TerminalDetalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [terminal, setTerminal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTerminal = async () => {
    try {
      const res = await api.get(`/api/terminales/${id}`);
      setTerminal(res.data);
    } catch (err) {
      console.error("Error obteniendo terminal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerminal();
  }, [id]);

  if (loading) return <p>Cargando detalles...</p>;
  if (!terminal) return <p>No se encontró el terminal.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalles del Terminal</h1>

      <div className="bg-white p-4 border rounded shadow-md w-full max-w-xl">

        <p><strong>TID:</strong> {terminal.tid}</p>
        <p><strong>Tipo:</strong> {terminal.tipo}</p>
        <p><strong>Modelo:</strong> {terminal.modelo}</p>
        <p><strong>Serie:</strong> {terminal.serie}</p>
        <p><strong>Marca:</strong> {terminal.marca}</p>
        <p><strong>Versión:</strong> {terminal.version}</p>
        <p><strong>SIM Card:</strong> {terminal.simcard}</p>
        <p><strong>Estado:</strong> {terminal.estado}</p>
        <p><strong>Creado:</strong> {terminal.created_at}</p>

      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Volver
      </button>
    </div>
  );
};

export default TerminalDetalles;
