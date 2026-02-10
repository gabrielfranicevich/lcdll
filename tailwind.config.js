export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'], // Added for "raw" feel
      },
      colors: {
        // "Humor Negro y Cinismo" Palette
        void: '#050505',      // Background
        surface: '#121212',   // Cards/Containers
        surfaceHighlight: '#1E1E1E',

        paper: '#F0F0F0',     // White cards
        ink: '#1A1A1A',       // Text on white cards

        primary: '#FFFFFF',   // Main text
        secondary: '#A0A0A0', // Subtitles/Hints

        accent: {
          blood: '#FF0033',   // Error / Critical / "Too far"
          toxic: '#CCFF00',   // Success / "Correct" / Highlight
          electric: '#00F0FF' // Info / Active state
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(255, 255, 255, 0.2)',
        'brutal-hover': '2px 2px 0px 0px rgba(255, 255, 255, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
