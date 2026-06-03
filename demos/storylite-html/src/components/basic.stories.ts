import type {
  StoryLiteMeta,
  StoryLiteParameters,
  StoryLiteRender,
  StoryLiteStoryDefinition,
} from '@storylite/storylite'
import badgeHtml from './badge.html?raw'
import buttonHtml from './button.html?raw'
import cardHtml from './card.html?raw'
import fieldHtml from './field.html?raw'
import { renderImportedCssDemo } from './imported-css-demo'
import layoutHtml from './layout.html?raw'
import css from '../styles.css?raw'

type TemplateArgs = Record<string, string | number | boolean>

type ButtonArgs = {
  label: string
  variant: 'primary' | 'secondary' | 'danger'
}

type CardArgs = {
  eyebrow: string
  title: string
  body: string
  action: string
}

type FieldArgs = {
  label: string
  placeholder: string
  type: 'email' | 'text' | 'search'
}

type BadgeArgs = {
  label: string
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

const parameters: StoryLiteParameters = { css }

export default {
  title: 'HTML/Components',
  parameters,
} satisfies StoryLiteMeta

export const Button = {
  args: {
    label: 'Save changes',
    variant: 'primary',
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
  },
  render: template(buttonHtml),
} satisfies StoryLiteStoryDefinition<ButtonArgs>

export const Card = {
  args: {
    eyebrow: 'Example',
    title: 'Layered component card',
    body: 'A plain article element rendered as a StoryLite component story.',
    action: 'Open',
  },
  render: template(cardHtml),
} satisfies StoryLiteStoryDefinition<CardArgs>

export const Field = {
  args: {
    label: 'Email address',
    placeholder: 'hello@storylite.dev',
    type: 'email',
  },
  argTypes: {
    type: { control: 'select', options: ['email', 'text', 'search'] },
  },
  render: template(fieldHtml),
} satisfies StoryLiteStoryDefinition<FieldArgs>

export const Badge = {
  args: {
    label: 'Baseline 2025',
  },
  render: template(badgeHtml),
} satisfies StoryLiteStoryDefinition<BadgeArgs>

export const Layout = {
  args: {
    first: 'Stories',
    second: 'Controls',
    third: 'Adapters',
  },
  render: template(layoutHtml),
} satisfies StoryLiteStoryDefinition<LayoutArgs>

export const ImportedCss = {
  name: 'Imported CSS',
  args: {
    label: 'Side-effect CSS import',
    detail: 'This card is styled by CSS imported from its helper module.',
  },
  render: renderImportedCssDemo,
} satisfies StoryLiteStoryDefinition<ImportedCssArgs>

function template<TArgs extends TemplateArgs>(html: string) {
  return ((args: TArgs) =>
    Object.entries(args).reduce(
      (output, [key, value]) => output.replaceAll(`{{ ${key} }}`, String(value)),
      html,
    )) satisfies StoryLiteRender<TArgs>
}
