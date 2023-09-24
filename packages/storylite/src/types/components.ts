import { ComponentProps } from 'react'

import { SLObject } from './core'

// Framework-agnostic component types for StoryLite

export type SLElement<P extends SLObject = {}> = {
  type: string
  props: P
  key: string | number | null
}

export type SLNode =
  | null
  | undefined
  | string
  | number
  | boolean
  | SLElement<any>
  | Iterable<SLNode>
// | SLFunctionComponent<any>

export type SLFunctionComponent<P extends SLObject = {}> = React.FC<P>

export type SLComponentProps<T> = T extends
  | React.ComponentType<infer P extends SLObject>
  | React.Component<infer P extends SLObject>
  ? {
      [key in keyof ComponentProps<SLFunctionComponent<P>>]: ComponentProps<
        SLFunctionComponent<P>
      >[key]
    }
  : never
