/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.edge",
    "./resources/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Adiciona Poppins como uma opção de fonte
      },
      animation: {
        wiggle: 'wiggle 0.5s linear infinite', // Animação personalizada "wiggle"
      },
      keyframes: {
        wiggle: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
      },
      boxShadow: {
        'custom': '0 0 30px rgba(129, 129, 129, 0.15)',
      },
    },
  },
  plugins: [],
};
