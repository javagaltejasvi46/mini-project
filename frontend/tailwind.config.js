/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-tint": "#c8bfff",
        "on-tertiary-fixed-variant": "#832700",
        "error-container": "#93000a",
        "primary-container": "#582cff",
        "primary": "#c8bfff",
        "surface-variant": "#353436",
        "inverse-surface": "#e5e2e3",
        "outline": "#928ea3",
        "secondary-container": "#00f4fe",
        "outline-variant": "#474557",
        "surface-container-highest": "#353436",
        "on-primary-fixed-variant": "#4100db",
        "surface-dim": "#131314",
        "on-primary": "#2c009e",
        "on-error": "#690005",
        "on-surface": "#e5e2e3",
        "background": "#131314",
        "on-tertiary": "#5c1900",
        "surface-container": "#201f20",
        "on-tertiary-container": "#ffccbc",
        "on-primary-container": "#d9d2ff",
        "error": "#ffb4ab",
        "on-background": "#e5e2e3",
        "primary-fixed": "#e5deff",
        "on-secondary-fixed": "#002021",
        "on-secondary-container": "#006c71",
        "surface": "#131314",
        "surface-container-lowest": "#0e0e0f",
        "surface-bright": "#3a393a",
        "secondary-fixed": "#63f7ff",
        "tertiary": "#ffb59c",
        "on-primary-fixed": "#190064",
        "secondary-fixed-dim": "#00dce5",
        "tertiary-fixed-dim": "#ffb59c",
        "surface-container-low": "#1c1b1c",
        "tertiary-fixed": "#ffdbd0",
        "on-surface-variant": "#c9c4da",
        "primary-fixed-dim": "#c8bfff",
        "on-error-container": "#ffdad6",
        "surface-container-high": "#2a2a2b",
        "on-secondary-fixed-variant": "#004f53",
        "on-tertiary-fixed": "#390c00",
        "on-secondary": "#003739",
        "tertiary-container": "#aa3500",
        "inverse-primary": "#592eff",
        "inverse-on-surface": "#313031",
        "secondary": "#e6feff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Inter"],
        "body": ["Inter"],
        "label": ["Inter"],
        "inter": ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [],
}
