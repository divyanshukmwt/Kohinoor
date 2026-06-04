/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design specifications colors
        "error": "#ba1a1a",
        "on-primary-container": "#ff7b7f",
        "primary-fixed": "#ffdad9",
        "on-error": "#ffffff",
        "secondary-fixed": "#ffddb2",
        "primary-fixed-dim": "#ffb3b2",
        "on-secondary": "#ffffff",
        "on-primary": "#ffffff",
        "primary-container": "#7a0019",
        "on-tertiary-fixed": "#291806",
        "background": "#fff8f0",
        "surface-tint": "#ae2e39",
        "on-secondary-container": "#785a2d",
        "on-primary-fixed": "#410009",
        "tertiary": "#33210e",
        "on-surface": "#1d1b16",
        "on-error-container": "#93000a",
        "on-secondary-fixed-variant": "#5d4218",
        "surface-variant": "#e8e2d9",
        "secondary-fixed-dim": "#e8c08b",
        "on-surface-variant": "#584141",
        "surface": "#fff8f0",
        "tertiary-fixed-dim": "#e1c1a4",
        "outline": "#8c7070",
        "surface-container-low": "#f9f3ea",
        "secondary": "#77592d",
        "surface-container-highest": "#e8e2d9",
        "on-background": "#1d1b16",
        "primary": "#51000d",
        "inverse-on-surface": "#f6f0e7",
        "surface-dim": "#dfd9d1",
        "surface-container-high": "#ede7df",
        "on-primary-fixed-variant": "#8d1324",
        "error-container": "#ffdad6",
        "surface-bright": "#fff8f0",
        "secondary-container": "#fdd39c",
        "on-tertiary-container": "#bd9f84",
        "inverse-surface": "#33302b",
        "tertiary-container": "#4b3621",
        "on-tertiary-fixed-variant": "#59422d",
        "on-secondary-fixed": "#291800",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#ffb3b2",
        "outline-variant": "#e0bfbe",
        "on-tertiary": "#ffffff",
        "surface-container": "#f3ede4",
        "tertiary-fixed": "#ffdcbf",
        "gold-accent": "#C6A16E",
        "beige-accent": "#D8B89C"
      },
      borderRadius: {
        "sm": "0.125rem",          // 2px
        "DEFAULT": "0.25rem",     // 4px
        "md": "0.375rem",          // 6px
        "lg": "0.5rem",            // 8px (for cards)
        "xl": "0.75rem",           // 12px
        "full": "9999px"           // badges/chips
      },
      spacing: {
        "gutter-desktop": "24px",
        "section-v": "64px",
        "base": "8px",
        "max-width": "1280px",
        "margin-desktop": "auto",
        "margin-mobile": "20px"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Manrope", "sans-serif"],
        // Retain original names as fallbacks
        "display-lg-mobile": ["Playfair Display", "serif"],
        "body-md": ["Manrope", "sans-serif"],
        "headline-lg": ["Playfair Display", "serif"],
        "button": ["Manrope", "sans-serif"],
        "label-md": ["Manrope", "sans-serif"],
        "headline-md": ["Playfair Display", "serif"],
        "body-lg": ["Manrope", "sans-serif"],
        "display-lg": ["Playfair Display", "serif"]
      },
      fontSize: {
        "display-lg-mobile": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "button": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    },
  },
  plugins: [],
}
