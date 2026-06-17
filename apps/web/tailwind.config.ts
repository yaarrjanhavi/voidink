import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          black: '#1a1614',
          paper: '#2a2420',
          fiber: '#342e28',
          faded: '#c4b8a8',
          ghost: '#8a8078',
          rust: '#8b3a2f',
          mold: '#4a5d4a',
          blood: '#6b2d3c',
        },
      },
      fontFamily: {
        display: ['"Special Elite"', 'monospace'],
        body: ['"Courier Prime"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
