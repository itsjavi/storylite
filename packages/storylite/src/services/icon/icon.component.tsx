import { createElement, HTMLAttributes, SVGProps } from 'react'

import { data } from './icon.data'
import { IconProps } from './icon.types'

export function Icon({
  className,
  icon,
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
}: IconProps) {
  const SVGComponent = ({ ...props }: HTMLAttributes<SVGProps<SVGElement>>) =>
    createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
        ...props,
      },
      [...data[icon].map(([tag, attrs]) => createElement(tag, attrs))],
    )

  return <SVGComponent />
}
