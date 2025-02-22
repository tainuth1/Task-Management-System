/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        regular: "#273754",
        second: "#8B8DA1",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
