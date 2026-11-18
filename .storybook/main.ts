import type { StorybookConfig } from '@storybook/react-vite';

process.env.STORYBOOK = 'true';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
