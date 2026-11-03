/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          light: '#f0f9ff',
          pastel: '#bae6fd',
          vivid: '#38bdf8',
          deep: '#0284c7',
        },
        grass: {
          light: '#dcfce7',
          pastel: '#86efac',
          vivid: '#22c55e',
          deep: '#15803d',
        },
        sunny: {
          light: '#fef08a',
          vivid: '#facc15',
          deep: '#eab308',
        },
        coral: {
          light: '#ffe4e6',
          vivid: '#fb7185',
        },
        lavender: {
          light: '#f3e8ff',
          vivid: '#c084fc',
        }
      },
      fontFamily: {
        fun: ['"Fredoka"', 'sans-serif'],
        sans: ['"Quicksand"', '"Plus Jakarta Sans"', 'sans-serif'],
        handwriting: ['"Patrick Hand"', 'cursive'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'wiggle': 'wiggle 2.5s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1.5deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      boxShadow: {
        'cloud': '0 20px 40px -15px rgba(56, 189, 248, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        'sticker': '4px 4px 0px 0px rgba(0, 0, 0, 0.85)',
        'sticker-lg': '6px 6px 0px 0px rgba(0, 0, 0, 0.9)',
        'sticker-hover': '2px 2px 0px 0px rgba(0, 0, 0, 0.9)',
        'mirror': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'pop': '0 10px 0 0 #0f172a',
      }
    },
  },
  plugins: [],
}
