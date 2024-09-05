import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'robot': "url('/robotBackground.png')",
      },
      backgroundPosition: {
        'center-left-10px': 'calc(50% - 20px) center',
      },
      colors: {
        'figma-red': '#E04E4E',
        'faded-max-white': 'rgba(255, 255, 255, 0.1)',
        'faded-mid-white': 'rgba(255, 255, 255, 0.2)',

      }
    },
  },
  plugins: [],
};
export default config;
