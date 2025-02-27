module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Ensure Tailwind scans the pages directory
    "./components/**/*.{js,ts,jsx,tsx}", // Add this if you have a components folder
    "./src/**/*.{js,ts,jsx,tsx}", // Keep src if you use it
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
