import type {
  StoryLiteMeta,
  StoryLiteParameters,
  StoryLiteStoryDefinition,
} from '@storylite/storylite'
import { ReactButton } from './ReactButton'
import { ReactCard } from './ReactCard'
import { ReactField } from './ReactField'
import { ReactImportedCssCard } from './ReactImportedCssCard'
import { ReactLayout } from './ReactLayout'

type ButtonArgs = {
  label: string
  variant: 'primary' | 'secondary'
  disabled: boolean
}

type CardArgs = {
  eyebrow: string
  title: string
  body: string
}

type FieldArgs = {
  label: string
  placeholder: string
}

type LayoutArgs = {
  first: string
  second: string
  third: string
}

type ImportedCssArgs = {
  label: string
  detail: string
}

const parameters: StoryLiteParameters = {
  renderer: 'react',
}

export default {
  title: 'React/Components',
  parameters,
} satisfies StoryLiteMeta

export const Button = {
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
  render: (args) => (
    <ReactButton label={args.label} variant={args.variant} disabled={args.disabled} />
  ),
} satisfies StoryLiteStoryDefinition<ButtonArgs>

export const Card = {
  args: {
    eyebrow: 'Adapter',
    title: 'React renderer',
    body: 'React stories mount inside the iframe without changing the StoryLite story model.',
  },
  render: (args) => <ReactCard eyebrow={args.eyebrow} title={args.title} body={args.body} />,
} satisfies StoryLiteStoryDefinition<CardArgs>

export const Field = {
  args: {
    label: 'Project name',
    placeholder: 'storylite-demo',
  },
  render: (args) => <ReactField label={args.label} placeholder={args.placeholder} />,
} satisfies StoryLiteStoryDefinition<FieldArgs>

export const Layout = {
  args: {
    first: 'Normalize',
    second: 'Render',
    third: 'Cleanup',
  },
  render: (args) => <ReactLayout first={args.first} second={args.second} third={args.third} />,
} satisfies StoryLiteStoryDefinition<LayoutArgs>

export const ImportedCss = {
  name: 'Imported CSS',
  args: {
    label: 'Side-effect CSS import',
    detail: 'This card is styled by CSS imported inside the React component.',
  },
  render: (args) => <ReactImportedCssCard label={args.label} detail={args.detail} />,
} satisfies StoryLiteStoryDefinition<ImportedCssArgs>
