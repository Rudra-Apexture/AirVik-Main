module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:tailwindcss/recommended',
  ],
  plugins: [
    'tailwindcss',
  ],
  rules: {
    'tailwindcss/no-arbitrary-value': 'error',
  },
  settings: {
    tailwindcss: {
      // These are the default values but can be overridden
      callees: ['classnames', 'clsx', 'ctl'],
      config: './tailwind.config.ts',
    },
  },
};
