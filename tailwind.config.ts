import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)', 'sans-serif'],
      },
      colors: {
        'common-white': '#FFF',
        'gray': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#ECECEC',
          300: '#D9D9D9',
          400: '#AEAEAE',
          500: '#8F8F8F',
          600: '#767676',
          700: '#555',
          800: '#333',
          900: '#171717',
        },
        'black': '#000',
        'primary': {
          50: '#F8FAFF',
          100: '#E7EFFF',
          200: '#C0D6FF',
          300: '#9EBFFF',
          400: '#70A1FF',
          500: '#2C74FF',
          600: '#0359FF',
          700: '#004AD9',
          800: '#003CB1',
          900: '#002E88',
        },
      },
    },
  },
  plugins: [],
};
export default config;
