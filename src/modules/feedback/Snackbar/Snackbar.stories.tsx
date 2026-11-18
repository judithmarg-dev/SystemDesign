import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { characterNames } from '@core';
import { Button } from '@modules/inputs/Button';
import { Snackbar } from './Snackbar';

const meta = {
  title: 'Feedback/Snackbar',
  component: Snackbar,
  args: {
    open: true,
    message: 'Acorn added to your stash',
    autoHideDuration: null,
    character: 'squirrel',
  },
  argTypes: {
    character: { control: 'select', options: [false, ...characterNames] },
    characterPlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    tone: { control: 'select', options: [undefined, 'primary', 'success', 'warning', 'error', 'info'] },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show snackbar</Button>
        <Snackbar
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          action={
            <Button size="sm" variant="text" onClick={() => setOpen(false)}>
              Undo
            </Button>
          }
        />
      </>
    );
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TopRight: Story = {
  args: { anchor: { vertical: 'top', horizontal: 'right' }, character: 'bear', tone: 'success' },
};

export const AutoHide: Story = { args: { open: false, autoHideDuration: 4000 } };

export const Plain: Story = { args: { character: false } };
