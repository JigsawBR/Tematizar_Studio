/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta extraída da logo Tematizar Studio
        roxo: {
          DEFAULT: "#A98BC6", // lilás principal
          escuro: "#8A66AE",
          claro: "#EDE4F5", // fundo de cards
        },
        rosa: {
          DEFAULT: "#E896BE",
          escuro: "#D97CAE",
          claro: "#FBE6F0",
        },
        creme: "#FBF4E7", // fundo da página / textos sobre cor
        ameixa: "#4A3556", // texto escuro
        borda: "#EBDDF2",
        cinza: "#8B7C93",
      },
      fontFamily: {
        titulo: ['"Baloo 2"', "cursive"],
        marca: ["Quicksand", "sans-serif"],
        corpo: ["Nunito", "sans-serif"],
      },
      spacing: {
        "4.5": "1.125rem",
      },
      borderRadius: {
        xl2: "18px",
      },
      boxShadow: {
        marca: "0 8px 24px rgba(138,102,174,.16)",
        "marca-hover": "0 14px 34px rgba(138,102,174,.26)",
      },
      maxWidth: {
        conteudo: "1240px",
      },
    },
  },
  plugins: [],
};
