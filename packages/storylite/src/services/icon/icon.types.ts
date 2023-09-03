import { HTMLAttributes, SVGProps } from 'react'

import { data } from './icon.data'

export type Icons = keyof typeof data

export type IconProps = {
  icon: Icons
  size?: number
  strokeWidth?: number
} & HTMLAttributes<SVGProps<SVGElement>>
