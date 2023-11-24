import type { ComponentProps, ReactNode } from 'react'

import type { SLObject } from './core'

// Framework-agnostic component types for StoryLite

export type SLElement<P extends SLObject = {}> = {
  type: string
  props: P
  key: string | number | null
}

export type SLNode = ReactNode

export type SLFunctionComponent<P = {}> = React.FC<P>

export type SLComponentProps<T> =
  | (T extends React.ComponentType<infer P extends SLObject>
      ? {
          [key in keyof ComponentProps<SLFunctionComponent<P>>]: ComponentProps<
            SLFunctionComponent<P>
          >[key]
        }
      : never)
  | (T extends React.Component<infer P extends SLObject>
      ? {
          [key in keyof ComponentProps<SLFunctionComponent<P>>]: ComponentProps<
            SLFunctionComponent<P>
          >[key]
        }
      : never)
