/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF9",
          100: "#FAF7F2",
          200: "#F2EBE0",
          300: "#E3D6C3",
        },
        cookly: {
          green: "#7EA842",
          greenDark: "#5E822E",
          greenLight: "#EBF3E1",
          brown: "#38291F",
          brownLight: "#685344",
          card: "#FFFFFF",
          amber: "#F59E0B"
        }
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif"
        ]
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(56, 41, 31, 0.06)',
        'float': '0 10px 30px -5px rgba(56, 41, 31, 0.1)',
        'nav': '0 -4px 25px rgba(56, 41, 31, 0.05)',
      }
    },
  },
  plugins: [],
}
