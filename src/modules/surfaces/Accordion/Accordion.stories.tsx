import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { characterNames } from '@core';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';

const meta = {
  title: 'Surfaces/Accordion',
  component: Accordion,
  args: { sx: { width: 380 } },
  argTypes: {
    character: { control: 'select', options: [false, ...characterNames] },
    characterVariant: { control: 'inline-radio', options: ['peek', 'silhouette'] },
    characterPlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionSummary>What should I pack?</AccordionSummary>
      <AccordionDetails>A warm scarf, a thermos of cocoa and a few acorns for the road.</AccordionDetails>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Peek: Story = { args: { character: 'hedgehog', characterPlacement: 'end', defaultExpanded: true } };

export const Group: Story = {
  render: (args) => {
    const [open, setOpen] = useState<string | false>('one');
    const panel = (id: string, title: string, body: string, disabled = false) => (
      <Accordion {...args} expanded={open === id} disabled={disabled} onChange={(_, expanded) => setOpen(expanded ? id : false)}>
        <AccordionSummary>{title}</AccordionSummary>
        <AccordionDetails>{body}</AccordionDetails>
      </Accordion>
    );
    return (
      <div style={{ width: 380 }}>
        {panel('one', 'Spring', 'Blossoms and the first bees.')}
        {panel('two', 'Summer', 'Long naps in the shade of the old oak.')}
        {panel('three', 'Autumn', 'Leaves to jump in and acorns to hide.')}
        {panel('four', 'Winter (soon)', 'Hibernation in progress.', true)}
      </div>
    );
  },
};
