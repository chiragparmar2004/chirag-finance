/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    boxShadow: {
      "custom-inset": "0px 0px 255px 255px  rgb(250, 249, 246	) inset",
    },
    extend: {
      keyframes: {
        gradient: {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        gradient: "gradient 3s ease infinite",
      },
    },
  },
  plugins: [],
};
