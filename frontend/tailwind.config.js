/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "neon-blue": "#4DEEEA",
        "neon-green": "#2FE8A0",
        "dark-glass": "rgba(17, 25, 40, 0.75)",
        "light-glass": "rgba(255, 255, 255, 0.1)",
      },
      backdropFilter: {
        glass: "blur(21px) saturate(180%)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          from: {
            "box-shadow":
              "0 0 10px #4DEEEA, 0 0 20px #4DEEEA, 0 0 30px #4DEEEA",
          },
          to: {
            "box-shadow":
              "0 0 20px #2FE8A0, 0 0 30px #2FE8A0, 0 0 40px #2FE8A0",
          },
        },
      },
    },
  },
  plugins: [],
};
