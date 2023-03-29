import React from 'react'

import globalStyles from '../styles/reset-main.css?inline'
import { ElementIds } from '../types'
import styles from './MainLayout.module.css'

export default function ErrorLayout({ children }: any) {
  return (
    <>
      <style id={ElementIds.MainGlobalStyles} dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div className={styles.Layout}>{children}</div>
    </>
  )
}
