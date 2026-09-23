import type {
  StoryLiteMeta,
  StoryLiteParameters,
  StoryLiteStoryDefinition,
} from '@storylite/storylite'
import SvelteButton from './SvelteButton.svelte'
import SvelteCard from './SvelteCard.svelte'
import SvelteStat from './SvelteStat.svelte'

const parameters: StoryLiteParameters = {
  renderer: 'svelte',
}

export default {
  title: 'Svelte/Components',
  parameters,
} satisfies StoryLiteMeta

export const Button = {
  component: SvelteButton,
  args: {
    label: 'Save changes',
    variant: 'primary',
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'secondary'] },
    disabled: { control: 'boolean' },
  },
} satisfies StoryLiteStoryDefinition

export const Card = {
  component: SvelteCard,
  args: {
    eyebrow: 'Adapter',
    title: 'Svelte renderer',
    body: 'Svelte components mount through a project-registered adapter.',
  },
} satisfies StoryLiteStoryDefinition

export const CardAsJson = {
  component: SvelteCard,
  args: {
    asJson: {
      eyebrow: 'Adapter',
      title: 'Svelte renderer',
      body: 'Svelte components mount through a project-registered adapter.',
    },
  },
  render: () => (internal, props) => SvelteCard(internal, props.asJson),
} satisfies StoryLiteStoryDefinition

export const Stat = {
  component: SvelteStat,
  args: {
    label: 'Stories',
    value: '3',
  },
} satisfies StoryLiteStoryDefinition
