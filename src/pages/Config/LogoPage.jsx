import { useEffect, useState } from "react";
import { logoService } from "../../services/logo.service";

export default function LogoPage() {
  const [logo, setLogo] = useState(null);
  const [archivo, setArchivo] = useState(null);

  const cargarLogo = async () => {
    const res = await logoService.get();
    setLogo(res.data.url);
  };

  useEffect(() => {
    cargarLogo();
  }, []);

  const subirLogo = async () => {
    if (!archivo) return;

    await logoService.upload(archivo);
    setArchivo(null);
    cargarLogo();
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
