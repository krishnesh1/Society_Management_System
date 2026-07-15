export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      colors: {
        ink: "#18181B",
        surface: "#FAFAF9",
        slate: {
          50: "#FAFAF9",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B"
        },
        brand: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46"
        },
        accent: {
          coral: "#E11D48",
          amber: "#D97706",
          violet: "#7C3AED",
          sky: "#0284C7"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(24, 24, 27, 0.04), 0 0 0 1px rgba(24, 24, 27, 0.04)",
        elevated: "0 8px 24px rgba(24, 24, 27, 0.08), 0 2px 6px rgba(24, 24, 27, 0.04)",
        sidebar: "1px 0 0 rgba(255,255,255,0.04)"
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        shimmer: "shimmer 1.4s infinite linear"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};
