import type { Meta, StoryObj } from '@storybook/react-vite';
import { Character, characterNames } from '@core';
import { Button } from '@modules/inputs/Button';
import { Card, CardActions, CardContent, CardHeader, CardMedia } from './Card';

// Inline placeholder so the story needs no network access.
const picture = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F9BD92"/><stop offset="1" stop-color="#F4C04E"/></linearGradient></defs><rect width="320" height="160" fill="url(#g)"/><circle cx="250" cy="48" r="26" fill="#FFF6EC" opacity=".8"/><path d="M0 160 L70 90 L130 130 L200 70 L320 160 Z" fill="#C4602A" opacity=".55"/></svg>',
)}`;

const meta = {
  title: 'Surfaces/Card',
  component: Card,
  args: { sx: { width: 320 } },
  argTypes: {
    character: { control: 'select', options: [false, ...characterNames] },
    characterVariant: { control: 'inline-radio', options: ['peek', 'silhouette'] },
    characterPlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader
        avatar={<Character name="hedgehog" size={40} />}
        title="Autumn picnic"
        subheader="Saturday, by the old oak"
      />
      <CardMedia src={picture} alt="Hills at sunset" height={140} />
      <CardContent>Bring a blanket and your favourite snack. Acorns will be provided.</CardContent>
      <CardActions>
        <Button size="sm">Join</Button>
        <Button size="sm" variant="text" color="neutral">
          Maybe later
        </Button>
      </CardActions>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const Interactive: Story = { args: { interactive: true } };

export const Peek: Story = { args: { character: 'squirrel', characterPlacement: 'end' } };

export const Silhouette: Story = {
  args: { character: 'mushroom', characterVariant: 'silhouette' },
  render: (args) => (
    <Card {...args}>
      <CardHeader title="Toadstool tea" subheader="Steeps in 4 minutes" sx={{ textAlign: 'center' }} />
      <CardContent sx={{ textAlign: 'center' }}>A warm cup for a rainy afternoon in the forest.</CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="sm" color="error">
          Brew
        </Button>
      </CardActions>
    </Card>
  ),
};
