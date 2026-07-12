import { useEffect, useState } from "react";
import { configuracionService } from "../services/configuracion.service";
import Header from "../components/Header";
import { Outlet, Link, useLocation } from "react-router-dom";

import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export default function DashboardLayout() {
  const [logo, setLogo] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [crmOpen, setCrmOpen] = useState(true);
  const { pathname } = useLocation();

  // Cargar logo desde la BD
  useEffect(() => {
    configuracionService.getLogo().then((res) => {
      setLogo(res.data.logo);
    });
  }, []);

  // ⭐ MENÚ OPERATIVO
  const mainMenu = [
    { label: "Dashboard", to: "/dashboard", icon: HomeIcon },
    { label: "Usuarios", to: "/usuarios", icon: UsersIcon },
    { label: "Órdenes de Servicio", to: "/ordenes", icon: ClipboardDocumentListIcon },
    { label: "Pipeline de Ventas", to: "/pipeline", icon: ClipboardDocumentListIcon },
  ];

  // ⭐ MENÚ CRM TAS CHILE
  const crmMenu = [
    { label: "Clientes", to: "/clientes", icon: UsersIcon },
    //{ label: "Comercios", to: "/comercios", icon: ClipboardDocumentListIcon },
    //{ label: "Terminales", to: "/terminales", icon: Cog6ToothIcon },
  ];

  // ⭐ CONFIGURACIÓN
  const configMenu = [
    { label: "Logo", to: "/config/logo", icon: Cog6ToothIcon },
    { label: "Estados OS", to: "/estados-os", icon: WrenchScrewdriverIcon },
    { label: "Pipeline (config)", to: "/config/pipeline", icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">

      {/* SIDEBAR */}
      <aside
        className={`bg-primary-dark text-white flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >

        {/* Logo + botón colapsar */}
        <div className="p-6 border-b border-primary flex items-center justify-between">
          {collapsed ? (
            logo ? (
              <img src={logo} className="h-10 object-contain mx-auto" />
            ) : (
              <span className="text-lg font-bold mx-auto">TC</span>
            )
          ) : (
            <div className="flex flex-col">
              {logo ? (
                <img src={logo} className="h-14 object-contain mb-1" />
              ) : (
                <h1 className="text-2xl font-bold">Tas Chile</h1>
              )}
              <p className="text-xs text-gray-300">CRM · Ventas & Soporte</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-primary transition ml-2"
          >
            {collapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-6">

          {/* ⭐ OPERACIONES */}
          <div>
            {!collapsed && (
              <p className="text-xs uppercase text-gray-300 mb-2 px-1">Operaciones</p>
            )}

            {mainMenu.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                    ${active ? "bg-primary text-white" : "hover:bg-primary/40"}
                  `}
                >
                  <Icon className="h-6 w-6" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* ⭐ CRM TAS CHILE (colapsable) */}
          <div>
            <button
              onClick={() => setCrmOpen(!crmOpen)}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-primary/40 transition"
            >
              <FolderIcon className="h-6 w-6" />
              {!collapsed && (
                <span className="text-sm font-semibold">CRM Tas Chile</span>
              )}
            </button>

            {crmOpen && (
              <div className="mt-2 ml-4 space-y-2">
                {crmMenu.map((item) => {
                  const active = pathname === item.to;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                        ${active ? "bg-primary text-white" : "hover:bg-primary/40"}
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ⭐ CONFIGURACIÓN */}
          <div>
            {!collapsed && (
              <p className="text-xs uppercase text-gray-300 mb-2 px-1">Configuración</p>
            )}

            {configMenu.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                    ${active ? "bg-primary text-white" : "hover:bg-primary/40"}
                  `}
                >
                  <Icon className="h-6 w-6" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary text-xs text-gray-300">
          {!collapsed ? "Sesión activa · CRM TAS" : "CRM TAS"}
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8 overflow-x-hidden relative">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}







