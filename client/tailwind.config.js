/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "80vw": "80vw",
        "50vw": "50vw",
        "20vw": "20vw",
      },
      maxHeight: {
        "80vh": "80vh",
        "50vh": "50vh",
      },
      width: {
        500: "500px",
        400: "400px",
        215: "215px",
        300: "300px",
        270: "270px",
        vw40: "40vw",
        vw30: "30vw",
        215: "215px",
      },
      height: {
        500: "500px",
        400: "400px",
        215: "215px",
        300: "300px",
        270: "270px",
        vh50: "50vh",
        vh40: "40vh",
        vh20: "20vh",
      },
      fontSize: {
        xxs: ".8rem",
        xss: ".6rem",
      },
      borderWidth: {
        1: "1px",
        3: "3px",
        5: "5px",
        8: "8px",
      },
      spacing: {
        25: "6.5rem",
      },
    },
    fontFamily: {
      jost: ["Jost", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    colors: {
      blue: "rgba(9, 55, 121)",
      cyan: "rgba(0, 212, 255, 1)",
      white: "#ffff",
      red: "#FF1E00",
      Dred: "#b30505",
      transparent: "rgba(0, 0, 0, 0)",
      green: "#54B435",
      grey: "#EEEEEE",
    },
  },
  plugins: [],
};
