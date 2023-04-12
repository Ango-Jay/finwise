/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "425px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        primary: "#D65A31",
        backdrop: "#222831",
        light: "#EEE",
        dark: "#393E46",
      },
    },
    plugins: [],
  },
};
