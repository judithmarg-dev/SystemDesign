import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { characterNames } from '@core';
import { Button } from '@modules/inputs/Button';
import { Modal } from './Modal';

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  args: {
    open: false,
    title: 'Save your acorns?',
    children: 'Winter is coming. Your stash will be tucked away safely until you need it again.',
    character: 'bear',
    characterVariant: 'peek',
    closeButton: true,
  },
  argTypes: {
    character: { control: 'select', options: [false, ...characterNames] },
    characterVariant: { control: 'inline-radio', options: ['peek', 'silhouette'] },
    characterPlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    characterSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    mood: { control: 'inline-radio', options: ['neutral', 'happy', 'sleepy', 'surprised'] },
    maxWidth: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button variant="text" color="neutral" onClick={() => setOpen(false)}>
                Not now
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        />
      </>
    );
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Peek: Story = { args: { open: true } };

export const Silhouette: Story = { args: { open: true, characterVariant: 'silhouette' } };

export const MushroomSilhouette: Story = {
  args: { open: true, character: 'mushroom', characterVariant: 'silhouette', maxWidth: 'xs' },
};

export const Plain: Story = { args: { open: true, character: false } };
