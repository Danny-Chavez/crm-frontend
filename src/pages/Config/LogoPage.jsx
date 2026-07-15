import { useEffect, useState } from "react";
import { configuracionService } from "../../services/configuracion.service";

export default function LogoPage() {
  const [logo, setLogo] = useState(null);
  const [archivo, setArchivo] = useState(null);

  // Cargar logo desde la BD con saneamiento
  const cargarLogo = async () => {
    try {
      const res = await configuracionService.getLogo();
      const logoBD = res.data.logo;

      // ⭐ SANEAR LOGO ANTIGUO PARA EVITAR ENOENT
      if (logoBD && typeof logoBD === "string" && logoBD.includes("/uploads/")) {
        console.warn("⚠ Logo antiguo detectado, se ignora para evitar ENOENT:", logoBD);
        setLogo(null);
      } else {
        setLogo(logoBD || null);
      }
    } catch (error) {
      console.error("Error cargando logo:", error);
    }
  };

  useEffect(() => {
    cargarLogo();
  }, []);

  // Subir logo como Base64
  const subirLogo = async () => {
    if (!archivo) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = reader.result;

        // ⭐ Guardar logo en la BD
        await configuracionService.updateLogo(base64);

        setArchivo(null);
        cargarLogo();
      } catch (error) {
        console.error("Error subiendo logo:", error);
      }
    };

    reader.readAsDataURL(archivo);
  };

  return (
    <div className="bg-surface p-6 rounded-xl shadow-md font-sans max-w-lg">
      <h1 className="text-2xl font-bold text-primary mb-4">
        Logo Corporativo Tas Chile
      </h1>

      {logo && (
        <div className="mb-4">
          <img
            src={logo}
            alt="Logo Tas Chile"
            className="h-20 object-contain"
          />
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="border border-border p-3 rounded-lg w-full text-sm 
                     focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
        />

        <button
          onClick={subirLogo}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition"
        >
          Subir
        </button>
      </div>
    </div>
  );
}


