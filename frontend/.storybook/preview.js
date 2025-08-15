import '../src/app/globals.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  designToken: {
    defaultTab: 'Colors',
    tabs: [
      {
        type: 'color',
        label: 'Colors',
        tokens: [
          'color-primary',
          'color-text',
          'color-muted',
          'color-neutral',
          'color-gray-bg',
        ],
      },
      {
        type: 'spacing',
        label: 'Spacing',
        tokens: ['space'],
      },
      {
        type: 'radius',
        label: 'Border Radius',
        tokens: ['radius'],
      },
    ],
  },
};
