/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales del Gobierno de Hidalgo
        primary: {
          DEFAULT: '#9F2241', // Pantone 7420 C - Color principal
          50: '#FDF2F4',
          100: '#FCE7EA',
          200: '#F9D0D6',
          300: '#F4A8B4',
          400: '#ED7A8D',
          500: '#E14B68',
          600: '#CD2E4F',
          700: '#B02240',
          800: '#9F2241', // Color base
          900: '#7A1B32'
        },
        secondary: {
          DEFAULT: '#235B4E', // Pantone 626 C
          50: '#F0F7F5',
          100: '#DCEEEA',
          200: '#B9DDD5',
          300: '#8BC5BA',
          400: '#5AA59A',
          500: '#3F8A7F',
          600: '#327066',
          700: '#2B5C53',
          800: '#235B4E', // Color base
          900: '#1A453B'
        },
        accent: {
          DEFAULT: '#DDC9A3', // Pantone 468 C
          50: '#FAF8F4',
          100: '#F5F1E9',
          200: '#EBE2D3',
          300: '#E1D3BD',
          400: '#DDC9A3', // Color base
          500: '#D4B888',
          600: '#C8A56D',
          700: '#B8925A',
          800: '#A07E4A',
          900: '#7D6139'
        },
        neutral: {
          DEFAULT: '#98989A', // Pantone Cool Gray 7 C
          50: '#F7F7F7',
          100: '#EEEEEE',
          200: '#DDDDDD',
          300: '#CCCCCC',
          400: '#BBBBBB',
          500: '#AAAAAA',
          600: '#98989A', // Color base
          700: '#777777',
          800: '#555555',
          900: '#333333'
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(159, 34, 65, 0.9) 0%, rgba(159, 34, 65, 0.7) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&auto=format&q=80')"
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        hidalgo: {
          "primary": "#9F2241",
          "secondary": "#235B4E", 
          "accent": "#DDC9A3",
          "neutral": "#98989A",
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FA",
          "base-300": "#E9ECEF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
}
