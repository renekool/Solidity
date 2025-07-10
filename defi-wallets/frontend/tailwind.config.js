/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        affine: {
          black: "#0A1118", // Fondo principal con tono ligeramente azul/verdoso
          darker: "#101822", // Fondo secundario más oscuro
          darkgray: "#192330", // Fondos de tarjetas
          gray: "#232D3A", // Fondos de elementos interactivos
          lightgray: "#8B96A5", // Texto secundario
          green: {
            DEFAULT: "#23C68B", // Verde principal
            dark: "#16A26A", // Verde para hover
            light: "#ADFFDA", // Verde claro para acentos
          },
          red: {
            DEFAULT: "#FF5555", // Valores negativos
            dark: "#D03F3F", // Rojo más oscuro
          },
          blue: {
            DEFAULT: "#3361FF", // Azul para elementos interactivos
            dark: "#254ECC", // Azul más oscuro
          },
        },
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"Inter"',
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 0 15px 2px rgba(35, 198, 139, 0.05)",
        glow: "0 0 20px 1px rgba(35, 198, 139, 0.1)",
      },
      borderWidth: {
        0.5: "0.5px",
      },
    },
  },
  plugins: [],
};
