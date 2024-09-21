/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#E51C26",
          secondary: "#FFDBDD",
          accent: "#2B3440",
          "base-100": "#ffffff",
        },
      },
      "light",
    ],
  },
};
