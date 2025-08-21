/** @type {import('tailwindcss').Config} */

// Added spacing options for each 0.25 steps up to 100.
// Supports (top, right, bottom, left, m, p) in range [0.25 - 100]
const spacing = {};
for (let i = 0; i < 100; i++) {
  spacing[`${i}.25`] = `${i * 4 + 1}px`;
  spacing[`${i}.5`] = `${i * 4 + 2}px`;
  spacing[`${i}.75`] = `${i * 4 + 3}px`;
  spacing[i + 1] = `${i * 4}px`;
}

const commonSizes = {
  '1/2': '50%',
  '1/4': '25%',
  '3/4': '75%',
};
for (let i = 5; i <= 100; i += 5) {
  commonSizes[`${i}/100`] = `${i}%`;
  if (i % 10 === 0) {
    commonSizes[`${i / 10}/10`] = `${i}%`;
  }
}

module.exports = {
  content: ['./App.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      spacing,
      inset: spacing,
      margin: spacing,
      padding: spacing,
      width: commonSizes,
      height: commonSizes,
    },
    screens: {
      sm: '360',
      md: '480',
      lg: '720',
      xl: '900',
      '2xl': '1200',
    },
  },
  plugins: [],
};
