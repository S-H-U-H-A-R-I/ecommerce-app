/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    backdropFilter: {
      'none': 'none',
      'blur': 'blur(20px)',
    },
    colors: {
      'custom-black': '#010409',
      'custom-gray': '#0d1117',
      'custom-gray-2': '#242a30',
    }
  },
};
export const plugins = [];

