/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Skyrim-inspirée (Nocturne/Sommeil)
        primary: {
          900: '#0a0a1a', // Fond principal
          800: '#1a1a2e', // Fond secondaire
          700: '#16213e', // Accent sombre
          600: '#0f3460', // Bleu profond
        },
        accent: {
          gold: '#ffd700', // Doré Skyrim
          ice: '#6bb6ff',  // Bleu glacé
          emerald: '#4ade80', // Vert
          purple: '#a855f7', // Violet
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#a0a0a0',
          muted: '#6b6b6b',
        },
        glow: {
          blue: 'rgba(107, 182, 255, 0.3)',
          gold: 'rgba(255, 215, 0, 0.3)',
        },
      },
      fontFamily: {
        skyrim: ['"MedievalSharp"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'skyrim-texture': "url('/src/assets/skyrim-texture.png')",
        'noise': "url('/src/assets/noise.png')",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'grow': 'grow 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(107, 182, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(107, 182, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        grow: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
