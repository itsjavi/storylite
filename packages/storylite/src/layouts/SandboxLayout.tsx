import userStyles from 'storylite-user-styles-sandbox'

import React from 'react'
import { useSearchParams } from 'react-router-dom'

import globalStyles from '../styles/reset-sandbox.css?inline'
import { ElementIds } from '../types'
import styles from './SandboxLayout.module.css'

export default function SandboxLayout({ children }: any) {
  const [searchParams] = useSearchParams()
  const isStandalone = searchParams.has('standalone')

  return (
    <>
      {!userStyles && (
        <style
          id={ElementIds.SandboxGlobalStyles}
          data-user-styles={'false'}
          dangerouslySetInnerHTML={{ __html: globalStyles }}
        />
      )}
      {userStyles && (
        <style
          id={ElementIds.SandboxGlobalStyles}
          data-user-styles={'true'}
          dangerouslySetInnerHTML={{ __html: userStyles }}
        />
      )}
      <div className={`${styles.Layout} ${isStandalone ? styles.Standalone : ''}`}>{children}</div>
    </>
  )
}
