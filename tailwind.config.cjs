module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#0057B8",        // Azul corporativo Tas Chile
        "primary-dark": "#003F82", // Azul oscuro para hover
        accent: "#F97316",         // Naranja corporativo
        "accent-dark": "#C65E12",  // Naranja oscuro para hover
        background: "#F3F4F6",     // Fondo general
        surface: "#FFFFFF",        // Cards, tablas, modales
        "text-main": "#1F2937",    // Texto principal
        "text-secondary": "#6B7280", // Texto secundario
        border: "#E5E7EB",         // Bordes suaves
      },
    },
  },
  plugins: [],
};

