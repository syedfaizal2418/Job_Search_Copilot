import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#010102",
        "surface-1": "#0e0f12",
        "surface-2": "#14151a",
        "surface-3": "#1c1d24",
        "surface-4": "#252730",
        hairline: "#23252a",
        "hairline-strong": "#343842",
        "hairline-tertiary": "#444955",
        primary: {
          DEFAULT: "#5e6ad2",
          hover: "#828fff",
          focus: "#5e69d1",
        },
        "brand-secure": "#7a7fad",
        ink: {
          DEFAULT: "#f7f8f8",
          muted: "#d0d6e0",
          subtle: "#8a8f98",
          tertiary: "#62666d",
        },
        semantic: {
          success: "#27a644",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "24px",
      },
      letterSpacing: {
        "display-xl": "-3px",
        "display-lg": "-1.8px",
        "display-md": "-1.0px",
        headline: "-0.6px",
        "card-title": "-0.4px",
        subhead: "-0.2px",
        body: "-0.05px",
        eyebrow: "0.4px",
      },
    },
  },
  plugins: [],
};
export default config;

