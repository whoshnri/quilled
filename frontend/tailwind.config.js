import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "DM Sans", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [typography],
};
