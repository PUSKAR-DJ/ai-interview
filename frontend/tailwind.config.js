/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F8FAFC",
        text: "#0F172A",
        muted: "#475569",
        accent: "#6366F1",
        accentSoft: "#E0E7FF",
      },
      backdropBlur: {
        glass: "12px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
