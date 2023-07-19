/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      mobile: "350px",
      xl: "1280px",
      md: "960px",
      // => @media (min-width: 640px) { ... }
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    daisyui,
    require("@tailwindcss/forms"),
  ],
};
