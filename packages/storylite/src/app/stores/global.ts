import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

import {
  getDefaultToolbarAddons,
  getToolbarAddonsAsParameters,
  resolveToolbarAddons,
} from '@/components/toolbar/getToolbarAddons'
import { SLAddonsMap, SLParameters, SLUserDefinedAddons } from '@/types'

import { StoryLiteActions, StoryLiteState } from './global.types'

const builtinAddons: SLAddonsMap = new Map(
  Array.from(getDefaultToolbarAddons().entries()).map(([id, addon]) => [id, { ...addon, id }]),
)

const defaultState: StoryLiteState = {
  canvas: {
    element: null,
    standalone: false,
  },
  config: {
    title: 'Story Lite',
    defaultStory: 'index',
    iframeProps: {},
    useIframeStyles: true,
    themeAttribute: 'data-theme',
    localStorageKey: 'storylite',
    children: null,
    addons: [],
  },
  parameters: {},
  addons: builtinAddons,
  stories: new Map(),
  currentStory: undefined,
}

const updateParameters = (
  state: StoryLiteState,
  params: SLParameters,
  options = { persist: false, crossWindow: false },
): StoryLiteState => {
  if (options.persist) {
    localStorage.setItem(
      `${state.config.localStorageKey}.parameters`,
      JSON.stringify(state.parameters),
    )
  }

  return {
    ...state,
    parameters: params,
  }
}

const resolveParams = (): SLParameters => {
  const localStorageParams = localStorage.getItem(
    `${defaultState.config.localStorageKey}.parameters`,
  )

  const builtinAddonParameters = getToolbarAddonsAsParameters(builtinAddons)

  const resolvedParams: SLParameters = localStorageParams
    ? JSON.parse(localStorageParams)
    : builtinAddonParameters

  return resolvedParams
}

export const useStoryLiteStore = createWithEqualityFn<StoryLiteState & StoryLiteActions>(set => {
  return {
    ...defaultState,
    parameters: resolveParams(),
    setAddons(addons: SLUserDefinedAddons) {
      console.log('ZUSTAND: setAddons')
      set(state => {
        return {
          ...state,
          addons: resolveToolbarAddons(builtinAddons, addons),
        }
      })
    },
    setStories(stories) {
      console.log('ZUSTAND: setStories')
      set(state => {
        return {
          ...state,
          stories: new Map(stories.entries()),
        }
      })
    },
    setConfig(config) {
      console.log('ZUSTAND: setConfig')
      set(state => {
        return {
          ...state,
          config: {
            ...state.config,
            ...config,
          },
        }
      })
    },
    initialize(config, stories) {
      console.log('ZUSTAND: initialize', config.addons, builtinAddons)
      set(state => {
        return {
          ...state,
          config: {
            ...state.config,
            ...config,
          },
          addons: resolveToolbarAddons(builtinAddons, config.addons),
          stories: new Map(stories.entries()),
        }
      })
    },
    setParameter(key, value, options = { persist: false, crossWindow: false }) {
      console.log('ZUSTAND: setParameter')
      set(state =>
        updateParameters(
          state,
          {
            ...state.parameters,
            [key]: {
              ...state.parameters[key],
              value,
            },
          },
          {
            persist: options.persist || false,
            crossWindow: options.crossWindow || false,
          },
        ),
      )
    },
    setParameters(data, options = { persist: false, crossWindow: false }) {
      console.log('ZUSTAND: setParameters')
      set(state =>
        updateParameters(state, data, {
          persist: options.persist || false,
          crossWindow: options.crossWindow || false,
        }),
      )
    },
    setCanvasElement(element) {
      console.log('ZUSTAND: setCanvasElement')
      set(state => {
        return {
          ...state,
          canvas: {
            ...state.canvas,
            element,
          },
        }
      })
    },
  }
}, shallow)

export const useStoryLiteIframe = (): {
  iframe: HTMLIFrameElement | null
  loaded: boolean
  setIframe: (element: HTMLIFrameElement | null) => void
  window: Window | null
  document: Document | null
} => {
  const [canvas, setElement] = useStoryLiteStore(state => [state.canvas, state.setCanvasElement])

  if (!canvas.element) {
    return {
      iframe: null,
      loaded: false,
      setIframe: setElement,
      window: null,
      document: null,
    }
  }

  const win = canvas.element.contentWindow ?? null
  const doc = canvas.element.contentDocument ?? canvas.element.contentWindow?.document ?? null

  return {
    iframe: canvas.element,
    setIframe: setElement,
    loaded: true,
    window: win,
    document: doc,
  }
}
