import { SLObject } from './core'

// Framework-agnostic component types for StoryLite

export type SLFunctionComponent<P extends SLObject = {}> = {
  (props: P, context?: any): SLNode
  displayName?: string | undefined
}

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
