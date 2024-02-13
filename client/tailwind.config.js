/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      slate: colors.slate,
      zinc: colors.zinc,
      neutral: colors.neutral,
      stone: colors.stone,
      red: colors.red,
      amber: colors.amber,
      yellow: colors.yellow,
      orange: colors.orange,
      lime: colors.lime,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indogp,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      rose: colors.rose,
      pink: colors.pink,
      "nude": "#e3d0c2",
      "blush": "#ecdfd7",
      "ivory": "#f7f0e6",
      "off-white": "#f4f3ef"
       // Configure your color palette here
    }
  },
  plugins: [require('flowbite/plugin')],
}
