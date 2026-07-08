import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#121417",
        mist: "#F5F7FA",
        line: "#E6EAF0",
        ocean: "#0A84FF",
        leaf: "#34C759",
        coral: "#FF6B5F"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(18, 20, 23, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
