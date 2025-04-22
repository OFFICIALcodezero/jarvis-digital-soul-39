import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        jarvis: "#1EAEDB", // Main JARVIS blue color
        jarvisDark: "#0C3D4D", // Darker shade
        jarvisLight: "#60CCED", // Lighter shade
        hologram: "#33C3F0", // Holographic color
        neon: "#8B5CF6", // Neon purple
        midnight: "#090C10", // Dark background
        circuit: "#131722", // Circuit background
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "text-glitch": {
          "0%, 100%": { opacity: "1", transform: "translateX(0)" },
          "10%": { opacity: "0.9", transform: "translateX(2px)" },
          "20%": { opacity: "1", transform: "translateX(-1px)" },
          "30%": { opacity: "0.9", transform: "translateX(0)" },
          "40%": { opacity: "1", transform: "translateX(-1px)" },
          "50%": { opacity: "0.9", transform: "translateX(2px)" },
          "60%": { opacity: "1", transform: "translateX(0)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "matrix-fall": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(1000%)" },
        },
        "flash": {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.5" },
          "100%": { opacity: "0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "float": {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px)",
            opacity: "0.6"
          },
          "50%": { 
            transform: "translateY(-10px) translateX(5px)",
            opacity: "0.8"
          }
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "75%, 100%": { transform: "scale(1.2)", opacity: "0" }
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" }
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "wave": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(60px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(60px) rotate(-360deg)" }
        },
        "circle-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)", opacity: "0.5" }
        },
        "subtle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" }
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
          "25%, 75%": { opacity: "0.9" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "text-glitch": "text-glitch 0.3s ease-in-out",
        "blink": "blink 1s step-start infinite",
        "matrix-fall": "matrix-fall 20s linear forwards",
        "flash": "flash 0.5s ease-in-out",
        "spin-slow": "spin-slow 3s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "wave": "wave 2.5s ease-in-out infinite",
        "orbit": "orbit 10s linear infinite",
        "circle-scale": "circle-scale 2s ease-in-out infinite",
        "subtle-bounce": "subtle-bounce 2s ease-in-out infinite",
        "flicker": "flicker 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
