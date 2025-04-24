import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        jarvis: {
          bg: "#0f1019",
          darkBg: "#080a12",
          accent: "#B30000",
          secondary: "#FFD700",
          text: "#ffffff",
          muted: "#8a8a9b"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        neon: "0 0 10px rgba(51, 195, 240, 0.3), 0 0 20px rgba(51, 195, 240, 0.2)",
        "neon-lg": "0 0 15px rgba(51, 195, 240, 0.5), 0 0 30px rgba(51, 195, 240, 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse": {
          "0%": { 
            boxShadow: "0 0 0 0 rgba(51, 195, 240, 0.7)",
            transform: "scale(0.95)"
          },
          "70%": { 
            boxShadow: "0 0 0 15px rgba(51, 195, 240, 0)",
            transform: "scale(1)"
          },
          "100%": { 
            boxShadow: "0 0 0 0 rgba(51, 195, 240, 0)",
            transform: "scale(0.95)"
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)"
          }
        },
        "rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" }
        },
        "glow": {
          "0%": { boxShadow: "0 0 5px #1eaedb, 0 0 10px #1eaedb, 0 0 15px #1eaedb" },
          "100%": { boxShadow: "0 0 20px #1eaedb, 0 0 30px #1eaedb, 0 0 40px #1eaedb" }
        },
        "reactor-pulse": {
          "0%": { opacity: "0.6", transform: "scale(0.98)" },
          "50%": { opacity: "0.8", transform: "scale(1)" },
          "100%": { opacity: "0.6", transform: "scale(0.98)" }
        },
        "reactor-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "reactor-glow": {
          "0%": { boxShadow: "0 0 20px #B30000, 0 0 40px #FFD700" },
          "50%": { boxShadow: "0 0 40px #B30000, 0 0 60px #FFD700" },
          "100%": { boxShadow: "0 0 20px #B30000, 0 0 40px #FFD700" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse": "pulse 4s infinite ease",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "rotate": "rotate 10s linear infinite",
        "glow-strong": "glow 1.5s ease-in-out infinite alternate",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "reactor-pulse": "reactor-pulse 4s ease-in-out infinite",
        "reactor-rotate": "reactor-rotate 20s linear infinite",
        "reactor-glow": "reactor-glow 3s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
