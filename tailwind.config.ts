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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
