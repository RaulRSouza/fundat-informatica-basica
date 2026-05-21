/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        petroleum: {
          DEFAULT: '#0d6e8a',
          50:  '#e8f6fa',
          100: '#c5e8f2',
          200: '#8dcfe6',
          300: '#52b0d3',
          400: '#2892bc',
          500: '#0d6e8a',
          600: '#0a5870',
          700: '#08455a',
          800: '#053344',
          900: '#02202e',
        },
        fundat: {
          DEFAULT: '#f5a623',
          50:  '#fff8ea',
          100: '#feecc5',
          200: '#fdd98b',
          300: '#fcc04d',
          400: '#f5a623',
          500: '#e88c08',
          600: '#c16e05',
          700: '#9a5208',
          800: '#7a3f0c',
          900: '#62310c',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
