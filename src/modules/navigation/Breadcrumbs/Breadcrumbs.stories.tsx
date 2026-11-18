import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const trail = [
  <a key="home" href="#home">
    Home
  </a>,
  <a key="forest" href="#forest">
    Forest
  </a>,
  <a key="oak" href="#oak">
    Old oak
  </a>,
  <a key="hollow" href="#hollow">
    Hollow
  </a>,
  <span key="pantry">Pantry</span>,
];

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  args: { children: trail, decorated: false },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Decorated: Story = { args: { decorated: true } };

export const Collapsed: Story = { args: { maxItems: 3 } };

export const CustomSeparator: Story = { args: { separator: '/' } };
