/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#123B63',
          dark: '#0B2D4D',
          light: '#1E5A8A',
        },
        inst: {
          blue: '#1E5A8A',
        },
        accent: {
          red: '#C62828',
          soft: '#FCECEC',
        },
        brand: {
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          textMain: '#1F2937',
          textSec: '#6B7280',
          border: '#E5E7EB',
          success: '#2E7D32',
          warning: '#F59E0B',
          error: '#C62828'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'page-heading': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'section-heading': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'card-heading': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-text': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'small-text': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'button-text': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'nav-text': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'stat-text': ['26px', { lineHeight: '32px', fontWeight: '600' }],
      }
    },
  },
  plugins: [],
}
