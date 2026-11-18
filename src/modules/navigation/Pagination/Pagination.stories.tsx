import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { count: 10, defaultPage: 4 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['glass', 'text', 'outlined'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Pagination {...args} variant="glass" />
      <Pagination {...args} variant="outlined" color="secondary" />
      <Pagination {...args} variant="text" color="success" />
      <Pagination {...args} disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Pagination {...args} size="sm" />
      <Pagination {...args} size="md" />
      <Pagination {...args} size="lg" />
    </div>
  ),
};

export const LongRange: Story = { args: { count: 40, defaultPage: 20, siblingCount: 2, boundaryCount: 2 } };

export const Controlled: Story = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <Pagination {...args} page={page} onChange={setPage} />
        <span>Showing acorns {(page - 1) * 10 + 1}–{page * 10}</span>
      </div>
    );
  },
};
