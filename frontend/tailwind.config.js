export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#16202A",
        pearl: "#F7F4EF",
        mist: "#E9EEF0",
        forest: "#1F6F5B",
        coral: "#E65D4F",
        amber: "#D99A28",
        violet: "#6E5ACF"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 32, 42, 0.10)",
        crisp: "0 10px 24px rgba(22, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};
