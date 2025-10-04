/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        text: '#E0E0E0',
        primary: '#FFFFFF',
        accent: '#1A3A3A',
        gold: '#D4AF37', // New premium gold color for highlights
      },
      // NEW SECTION FOR THE VINYL TEXTURE
      backgroundImage: {
        'vinyl-grooves': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%25' height='100%25'%3e%3cdefs%3e%3cpattern id='p' width='100' height='100' patternUnits='userSpaceOnUse'%3e%3ccircle cx='50' cy='50' r='45' stroke='%231F1F1F' stroke-width='2' fill='none'/%3e%3ccircle cx='50' cy='50' r='35' stroke='%231F1F1F' stroke-width='1' fill='none'/%3e%3ccircle cx='50' cy='50' r='25' stroke='%231F1F1F' stroke-width='1' fill='none'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23p)'/%3e%3c/svg%3e")`,
      },
      // YOUR EXISTING ANIMATIONS (PRESERVED)
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'modal-pop': 'modalPop 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalPop: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      boxShadow: {
        'inner-xl': 'inset 0 10px 15px 0 rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}