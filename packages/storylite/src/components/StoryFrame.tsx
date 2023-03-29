import React from 'react'

import { ElementIds } from '@/types'

import styles from './StoryFrame.module.css'

type StoryFrameProps = {
  story?: string
  exportName?: string
}

export default function StoryFrame({ story, exportName }: StoryFrameProps) {
  const iframeSrc =
    story === undefined ? '/sandbox/dashboard' : `/sandbox/stories/${story}/${exportName || ''}`

  return <iframe id={ElementIds.Iframe} className={styles.Frame} src={iframeSrc} />
}
