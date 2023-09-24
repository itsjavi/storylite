import boxSelectIcon from '@/assets/lucide/svg/box-select.svg'
import contrastIcon from '@/assets/lucide/svg/contrast.svg'
import expandIcon from '@/assets/lucide/svg/expand.svg'
import externalLinkIcon from '@/assets/lucide/svg/external-link.svg'
import gridIcon from '@/assets/lucide/svg/grid-3x3.svg'
import monitorSmartphoneIcon from '@/assets/lucide/svg/monitor-smartphone.svg'
import moonIcon from '@/assets/lucide/svg/moon.svg'
import sunIcon from '@/assets/lucide/svg/sun.svg'
import xCircleIcon from '@/assets/lucide/svg/x-circle.svg'
import { InlineHtml } from '@/components/InlineHtml'
import { getStoryUrl } from '@/services/csf-api/navigation'

import {
  SLColorScheme,
  SLCoreAddon,
  type SLAddonProps,
  type SLAddonPropsWithoutId,
  type SLAddonsMap,
  type SLAddonsMapWithoutId,
  type SLParameters,
  type SLUserDefinedAddons,
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
      defaultContent: <InlineHtml>{gridIcon}</InlineHtml>,
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
      defaultContent: <InlineHtml>{monitorSmartphoneIcon}</InlineHtml>,
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
      defaultContent: <InlineHtml>{boxSelectIcon}</InlineHtml>,
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
      defaultContent: <InlineHtml>{expandIcon}</InlineHtml>,
      activeContent: <InlineHtml>{xCircleIcon}</InlineHtml>,
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
      defaultContent: <InlineHtml>{externalLinkIcon}</InlineHtml>,
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
      defaultContent: <InlineHtml>{sunIcon}</InlineHtml>,
      activeContent: <InlineHtml>{moonIcon}</InlineHtml>,
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
          return <InlineHtml>{contrastIcon}</InlineHtml>
        }

        return value === SLColorScheme.Light ? (
          <InlineHtml>{sunIcon}</InlineHtml>
        ) : (
          <InlineHtml>{moonIcon}</InlineHtml>
        )
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
