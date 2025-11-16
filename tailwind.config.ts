/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],

  theme: {
    colors: {
      blue: "#1fb6ff",
      purple: "#7e5bef",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#13ce66",
      yellow: "#ffc82c",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#d3dce6",
      primaryD: "#272727",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      theme: {
        colors: {
          brand: {
            DEFAULT: "#1D4ED8", // your main brand color
            light: "#3B82F6", // optional lighter shade
            dark: "#1E40AF", // optional darker shade
          },
        },
      },

      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
};
