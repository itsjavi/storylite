import { getStoryUrl } from '@/services/csf-api/navigation'
import { Icon } from '@/services/icon'

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
import { isTruthy } from '../../utility'

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
      defaultContent: <Icon icon={'grid'} />,
      stateful: true,
      persistent: true,
      defaultValue: false,
      onClick: (_, [value, setValue]) => {
        setValue(!value, { persist: true })
      },
      isActive: (_, [value]) => value === true,
    },
  ]

  const getCanvasRoot = (): HTMLElement | null => {
    return window.document.querySelector('.storylite-canvas-root:first-of-type')
  }

  const updateCanvasRootWidth = (rootElement: HTMLElement, newWidth: string | false) => {
    if (!(rootElement instanceof HTMLElement)) {
      return
    }
    if (!newWidth) {
      rootElement.style.width = ''

      return
    }

    rootElement.style.width = newWidth
  }

  const updateCanvasRootResponsiveInfo = (rootElement: HTMLElement, newValue: string | false) => {
    let infoElement: HTMLDivElement | null = rootElement.querySelector(
      '.sl-responsive-info:first-of-type',
    )
    if (!infoElement) {
      infoElement = document.createElement('div')
      infoElement.className = 'sl-responsive-info'
      rootElement.appendChild(infoElement)
    }

    if (!newValue) {
      infoElement.innerText = ''

      return
    }

    infoElement.innerText = newValue
  }

  const responsiveAddon: AddonSetup = [
    SLCoreAddon.Responsive,
    {
      tooltip: 'Toggle mobile view',
      defaultContent: <Icon icon={'monitorSmartphone'} />,
      stateful: true,
      persistent: true,
      defaultValue: false,
      onClick: (ctx, [value, setValue]) => {
        const mobileWidth = '375px' // like an iPhone 12 Mini
        const oppositeValue = value ? false : mobileWidth

        const canvasRoot = getCanvasRoot()
        if (!canvasRoot) {
          return
        }

        updateCanvasRootWidth(canvasRoot, oppositeValue)
        updateCanvasRootResponsiveInfo(canvasRoot, oppositeValue)
        setValue(oppositeValue, { persist: true })
      },
      onRender: (ctx, [value]) => {
        const canvasRoot = getCanvasRoot()
        if (!canvasRoot) {
          return
        }
        const _val = value ? String(value) : false
        updateCanvasRootWidth(canvasRoot, _val)
        updateCanvasRootResponsiveInfo(canvasRoot, _val)
      },
      isActive: (_, [value]) => isTruthy(value),
    } satisfies SLAddonPropsWithoutId<true>,
  ]

  const outlineAddon: AddonSetup = [
    SLCoreAddon.Outline,
    {
      tooltip: 'Toggle outlines',
      defaultContent: <Icon icon={'boxSelect'} />,
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
      defaultContent: <Icon icon={'expand'} />,
      activeContent: <Icon icon={'xCircle'} />,
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
      defaultContent: <Icon icon={'externalLink'} />,
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
      defaultContent: <Icon icon={'sun'} />,
      activeContent: <Icon icon={'moon'} />,
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
          return <Icon icon={'contrast'} />
        }

        return value === SLColorScheme.Light ? <Icon icon={'sun'} /> : <Icon icon={'moon'} />
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
