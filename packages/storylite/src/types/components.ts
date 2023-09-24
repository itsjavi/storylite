import React, { type ComponentProps, type JSXElementConstructor } from 'react'

// Component type aliases for StoryLite, to abstract the underlying framework

export type SLElement = React.ReactElement<any, any>

export type SLNode = React.ReactNode

export type SLFunctionComponent<P = {}> = React.FC<P>

export type SLComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentProps<T>
