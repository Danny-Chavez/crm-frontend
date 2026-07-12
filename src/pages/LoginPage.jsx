import { useState, useEffect } from "react";
import useAuth from "../auth/useAuth";
import api from "../utils/axios";   // ⭐ IMPORTANTE
import { configuracionService } from "../services/configuracion.service";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { setUser } = useAuth();   // ⭐ Necesitamos guardar usuario
  const navigate = useNavigate();

  const [logo, setLogo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Cargar logo dinámico desde la BD
  useEffect(() => {
    configuracionService.getLogo().then((res) => {
      setLogo(res.data.logo);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HANDLE SUBMIT EJECUTADO");

    setError("");
    setLoading(true);

    try {
      // ⭐ LOGIN REAL AL BACKEND
      const res = await api.post("/auth/login", form);

      // ⭐ GUARDAR TOKEN CORRECTO
      localStorage.setItem("token", res.data.token);

      // ⭐ GUARDAR USUARIO EN CONTEXTO
      setUser(res.data.usuario);

      // ⭐ REDIRIGIR
      navigate("/ordenes");

    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales incorrectas");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark font-sans">

      <div className="bg-surface p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fadeInUp">

        {/* Logo dinámico */}
        <div className="text-center mb-6">
          {logo ? (
            <img
              src={logo}
              alt="Logo Tas Chile"
              className="h-20 mx-auto mb-2 object-contain"
            />
          ) : (
            <h1 className="text-3xl font-bold text-primary">Tas Chile</h1>
          )}

          <p className="text-sm text-text-secondary mt-1">
            CRM · Ventas & Soporte
          </p>
        </div>

        <h2 className="text-xl font-semibold text-text-main mb-4 text-center">
          Iniciar Sesión
        </h2>

        {/* Error visual */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-2 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-text-main">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border border-border p-3 rounded-lg text-sm 
                        focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="tu@correo.com"
            />
          </div>

          {/* Contraseña + botón mostrar */}
          <div>
            <label className="text-sm font-medium text-text-main">
              Contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full border border-border p-3 rounded-lg text-sm 
                          focus:ring-2 focus:ring-primary focus:border-primary outline-none pr-12"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg 
                      text-sm font-semibold transition shadow-md disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        {/* Footer corporativo */}
        <div className="text-center mt-6 text-xs text-text-secondary">
          © {new Date().getFullYear()} Tas Chile · CRM Corporativo
        </div>
      </div>
    </div>
  );
}







