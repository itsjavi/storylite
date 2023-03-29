import React, { HTMLAttributes } from 'react'

type PolymorphicPropsFactory<T, P> = {
  as?: T | React.ElementType
  children?: React.ReactNode | undefined
  className?: string | undefined
} & React.RefAttributes<T> &
  P

export type PolymorphicProps<T, FallbackPropsType> =
  // as = Function Component
  T extends React.FunctionComponent<infer P>
    ? PolymorphicPropsFactory<T, P>
    : // as = Class Component
    T extends React.ComponentClass<infer P>
    ? PolymorphicPropsFactory<T, P>
    : // as = HTML Tag
    T extends string
    ? PolymorphicPropsFactory<T, React.HTMLAttributes<T>>
    : // ... fallback
      PolymorphicPropsFactory<T, FallbackPropsType>

export type ButtonElementProps<P, V> = HTMLAttributes<HTMLButtonElement> & P & V
export type DivElementProps<P, V> = HTMLAttributes<HTMLDivElement> & P & V
export type FormElementProps<P, V> = HTMLAttributes<HTMLFormElement> & P & V
export type AnchorElementProps<P, V> = HTMLAttributes<HTMLAnchorElement> & P & V
export type VariantElementProps<P, V, E extends HTMLElement> = HTMLAttributes<E> & P & V
