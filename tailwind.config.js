export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00f3ff', // CYANISED (Role: Normal/Safe)
          red: '#ff003c',   // DEEP NEON (Role: Hack/Danger)
          yellow: '#ffea00', // STROBE (Role: Warning)
        },
        void: '#050505', // Deep space black
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'scanlines': 'repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)',
      },
    },
  },
  plugins: [],
}
