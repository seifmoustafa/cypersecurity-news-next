import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./core/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        cyber: {
          primary: "hsl(var(--cyber-primary))",
          secondary: "hsl(var(--cyber-secondary))",
          accent: "hsl(var(--cyber-accent))",
          warning: "hsl(var(--cyber-warning))",
          danger: "hsl(var(--cyber-danger))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "var(--font-roboto)", "sans-serif"],
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        blink: "blink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        typing: "typing 3.5s steps(40, end)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(rgba(0, 120, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 120, 255, 0.1) 1px, transparent 1px)",
        "cyber-radial": "radial-gradient(circle, rgba(0, 120, 255, 0.1) 0%, transparent 70%)",
      },
      backgroundSize: {
        "cyber-grid": "20px 20px",
      },
      textShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
        DEFAULT: "0 2px 4px rgba(0, 0, 0, 0.2)",
        lg: "0 8px 16px rgba(0, 0, 0, 0.2)",
        glow: "0 0 10px rgba(0, 120, 255, 0.7)",
      },
      boxShadow: {
        cyber: "0 0 15px rgba(0, 120, 255, 0.5)",
        "cyber-lg": "0 0 30px rgba(0, 120, 255, 0.7)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    ({ addUtilities }) => {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        },
        ".text-shadow-md": {
          textShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        ".text-shadow-lg": {
          textShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
        ".text-shadow-glow": {
          textShadow: "0 0 10px rgba(0, 120, 255, 0.7)",
        },
      }
      addUtilities(newUtilities)
    },
  ],
} satisfies Config

export default config
