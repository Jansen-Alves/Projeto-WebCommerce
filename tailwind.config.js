/** @type {import('tailwindcss').Config} */
export default {
  content: ["./resources/**/*.edge",
    "./resources/**/*.{js,ts}",],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Adiciona Poppins como uma opção de fonte
      },
    },
  },
  plugins: [],
}

