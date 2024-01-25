/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        claret: "#7b1c58",
        "scampi-blue": "#7276b1",
        "scampi-blue-low-opacity": "#7276b118",
        "gradis-yellow": "#ffd895",
      },
    },
  },
  plugins: [],
};
