import {
  BoxSelectIcon,
  ContrastIcon,
  ExpandIcon,
  ExternalLinkIcon,
  GridIcon,
  MonitorSmartphoneIcon,
  MoonIcon,
  SunIcon,
  XCircleIcon,
} from 'lucide-react'

import { getStoryUrl } from '@/services/csf-api/navigation'

import {
  SLAddonProps,
  SLAddonPropsWithoutId,
  SLAddonsMap,
  SLAddonsMapWithoutId,
  SLColorScheme,
  SLCoreAddon,
  SLParameters,
  SLUserDefinedAddons,
} from '../..'
import { isNotEmpty, isTruthy } from '../../utility'

export function getToolbarAddonsAsParameters(addons: SLAddonsMap): SLParameters {
  const parameters: SLParameters = {}

  Array.from(addons.entries())
    .filter(([, value]) => value.stateful)
    .forEach(([key, value]) => {
      parameters[key] = {
        value: typeof value.defaultValue === 'function' ? value.defaultValue() : value.defaultValue,
      }
    })

  return parameters
}

type AddonSetup = [string, SLAddonPropsWithoutId<true | false>]

function getDefaultLeftToolbarAddons(): AddonSetup[] {
  const gridAddon: AddonSetup = [
    SLCoreAddon.Grid,
    {
      tooltip: 'Toggle grid',
      defaultContent: <GridIcon />,
      stateful: true,
      persistent: true,
      defaultValue: false,
      onClick: (_, [value, setValue]) => {
        setValue(!value, { persist: true })
      },
      isActive: (_, [value]) => value === true,
    },
  ]

  const responsiveAddon: AddonSetup = [
    SLCoreAddon.Responsive,
    {
      tooltip: 'Toggle mobile view',
      defaultContent: <MonitorSmartphoneIcon />,
      stateful: true,
      persistent: true,
      defaultValue: false,
      isVisible: ctx => isNotEmpty(ctx.canvas.element),
      onClick: (ctx, [value, setValue]) => {
        if (!ctx.canvas.element) {
          return
        }
        const mobileWidth = '375px' // like an iPhone 12 Mini

        if (!value) {
          ctx.canvas.element.style.width = mobileWidth
          const div = document.createElement('div')
          div.className = 'sl-responsive-info'
          div.innerText = mobileWidth
          ctx.canvas.element.parentElement?.appendChild(div)
          setValue(mobileWidth, { persist: true })

          return
        }
        ctx.canvas.element.style.width = ''
        ctx.canvas.element.parentElement?.querySelector('.sl-responsive-info')?.remove()
        setValue(false, { persist: true })
      },
      onRender: (ctx, [value]) => {
        if (!ctx.canvas.element) {
          return
        }
        if (value) {
          ctx.canvas.element.style.width = value as string
        }
      },
      isActive: (_, [value]) => isTruthy(value),
    } satisfies SLAddonPropsWithoutId<true>,
  ]

  const outlineAddon: AddonSetup = [
    SLCoreAddon.Outline,
    {
      tooltip: 'Toggle outlines',
      defaultContent: <BoxSelectIcon />,
      stateful: true,
      persistent: true,
      defaultValue: false,
      onClick: (_, [value, setValue]) => {
        setValue(!value, { persist: true })
      },
      isActive: (_, [value]) => value === true,
    } satisfies SLAddonPropsWithoutId<true>,
  ]

  return [gridAddon, responsiveAddon, outlineAddon]
}

function getDefaultRightToolbarAddons(): AddonSetup[] {
  const placement = 'right'

  const expandAddon: AddonSetup = [
    SLCoreAddon.Maximize,
    {
      tooltip: 'Toggle maximized view',
      defaultContent: <ExpandIcon />,
      activeContent: <XCircleIcon />,
      placement,
      stateful: true,
      persistent: true,
      defaultValue: false,
      onClick: (_, [value, setValue]) => {
        setValue(!value, { persist: true })
      },
      isActive: (_, [value]) => value === true,
    } satisfies SLAddonPropsWithoutId<true>,
  ]

  const openStoryAddon: AddonSetup = [
    SLCoreAddon.OpenStory,
    {
      tooltip: 'View story in a new tab',
      defaultContent: <ExternalLinkIcon />,
      placement,
      stateful: false,
      hrefTarget: '_blank',
      getHref: ctx => {
        const urlOpts = {
          target: 'iframe',
          standalone: true,
        } satisfies Parameters<typeof getStoryUrl>[1]

        return getStoryUrl(ctx.currentStoryId, urlOpts)
      },
    } satisfies SLAddonPropsWithoutId<false>,
  ]

  const darkModeAddon: AddonSetup = [
    SLCoreAddon.ColorScheme,
    {
      tooltip: 'Toggle Dark/Light/Auto theme',
      defaultContent: <SunIcon />,
      activeContent: <MoonIcon />,
      placement,
      stateful: true,
      persistent: true,
      defaultValue: SLColorScheme.Auto,
      onClick: (_, [value, setValue]) => {
        // Rotate between Auto -> Light -> Dark
        if (value === SLColorScheme.Light) {
          setValue(SLColorScheme.Auto, { persist: true })

          return
        }
        if (value === SLColorScheme.Dark) {
          setValue(SLColorScheme.Light, { persist: true })

          return
        }
        setValue(SLColorScheme.Dark, { persist: true })
      },
      render: (_, [value]) => {
        if (value === SLColorScheme.Auto || !value) {
          return <ContrastIcon />
        }

        return value === SLColorScheme.Light ? <SunIcon /> : <MoonIcon />
      },
      isActive: (_, [value]) => value !== SLColorScheme.Auto,
    } satisfies SLAddonPropsWithoutId<true>,
  ]

  return [expandAddon, openStoryAddon, darkModeAddon]
}

export function getDefaultToolbarAddons(): SLAddonsMapWithoutId {
  return new Map([...getDefaultLeftToolbarAddons(), ...getDefaultRightToolbarAddons()])
}

export function resolveToolbarAddons(
  defaultAddons: SLAddonsMapWithoutId | SLAddonsMap,
  userAddons?: SLUserDefinedAddons,
): SLAddonsMap {
  const resolvedAddons = new Map<SLCoreAddon | string, SLAddonProps<boolean>>()

  // Create a simple array with default and user addons
  const allAddons = [...defaultAddons.entries(), ...(userAddons ?? [])]

  // Populate mergedAddons in a single loop
  allAddons.forEach(([key, props]) => {
    if (props === false) {
      resolvedAddons.delete(key)

      return
    }

    const defaultProps = defaultAddons.get(key) ?? {}
    const combinedProps = { ...defaultProps, ...props, id: key }
    resolvedAddons.set(key, combinedProps)
  })

  return resolvedAddons
}
