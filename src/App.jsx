import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./auth/PrivateRoute";
import AuthLayout from "./layouts/AuthLayout";

// Páginas existentes
import LoginPage from "./pages/LoginPage";
import UsuariosPage from "./pages/Usuarios/UsuariosPage";
import EstadosOSPage from "./pages/EstadosOS/EstadosOSPage";
import OrdenesPage from "./pages/Ordenes/OrdenesPage";
import Pipeline from "./pages/Pipeline/Pipeline";
import LogoPage from "./pages/Config/LogoPage";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import TerminalDetalles from "./pages/terminales/TerminalDetalles";

// ⭐ NUEVAS PÁGINAS CRM
import Clientes from "./pages/clientes/Clientes";
import Comercios from "./pages/comercios/Comercios";
import Terminales from "./pages/terminales/Terminales";
import OrdenesPorTerminal from "./pages/Ordenes/OrdenesPorTerminal";
import OrdenDetalles from "./pages/Ordenes/OrdenDetalles";

// ⭐ CONFIGURACIÓN DEL PIPELINE
import PipelineConfig from "./pages/Config/PipelineConfig";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        {/* RUTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* HOME DEL CRM */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardHome />} />

          {/* USUARIOS */}
          <Route path="/usuarios" element={<UsuariosPage />} />

          {/* ESTADOS OS */}
          <Route path="/estados-os" element={<EstadosOSPage />} />

          {/* ORDENES GLOBAL */}
          <Route path="/ordenes" element={<OrdenesPage />} />

          {/* PIPELINE */}
          <Route path="/pipeline" element={<Pipeline />} />

          {/* CONFIGURACIÓN */}
          <Route path="/config/logo" element={<LogoPage />} />
          <Route path="/config/pipeline" element={<PipelineConfig />} />

          {/* ⭐ CRM TAS CHILE */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/:cliente_id/comercios" element={<Comercios />} />

          <Route path="/comercios/:comercio_id/terminales" element={<Terminales />} />
          <Route path="/terminales/:id/os" element={<OrdenesPorTerminal />} />
          <Route path="/terminales/:id/detalles" element={<TerminalDetalles />} />
          <Route path="/ordenes/:id" element={<OrdenDetalles />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}






