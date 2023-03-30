/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        AMP_GREEN: "#1ab394",
        FONT_COLOR: "#676a6c"
      }
    }
  }
}
