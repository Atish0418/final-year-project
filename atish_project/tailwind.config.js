/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        lg: "1240px",
        xl: "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      colors: {
        primary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#4F46E5",
          foreground: "#ffffff",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#F9FAFB",
          card: "#F3F4F6",
          bg: "#9A9A9A",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#0F172A",
          900: "#0B1221",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 0, 0, 0.05)",
        card: "0 10px 30px -10px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
