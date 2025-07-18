/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./water_slide_theme.html",
    "./water_slide_theme_optimized.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./**/*.html"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // LMU Brand Colors
        'lmu-blue': '#002147',
        'lmu-crimson': '#9e1b32',
        'lmu-blue-light': '#001b3a',
        'lmu-crimson-light': '#801628',
        'accent-light': '#f0f4fa'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      screens: {
        'xs': '475px'
      }
    },
  },
  plugins: [
    // Add any required plugins here
  ],
  // Optimize for production builds
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./index.html",
      "./water_slide_theme.html", 
      "./water_slide_theme_optimized.html",
      "./src/**/*.{js,ts,jsx,tsx,html}",
      "./**/*.html"
    ],
    options: {
      safelist: [
        // Always include these classes
        'dark',
        'light',
        'visible',
        'fade-in',
        'btn-primary',
        'toggle-switch',
        'hero-section',
        'hero-image',
        'hero-overlay'
      ]
    }
  }
}