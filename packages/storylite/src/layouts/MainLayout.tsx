import userStyles from 'storylite-user-styles-ui'

import React from 'react'

import Sidebar from '../components/Sidebar'
import SidebarTitle from '../components/SidebarTitle'
import globalStyles from '../styles/reset-main.css?inline'
import { ElementIds } from '../types'
import styles from './MainLayout.module.css'

export default function MainLayout({ children }: any) {
  return (
    <>
      <style
        id={ElementIds.MainGlobalStyles}
        data-user-styles={'false'}
        data-testid="styles-global"
        dangerouslySetInnerHTML={{ __html: globalStyles }}
      />

      {userStyles && (
        <style
          id={ElementIds.MainGlobalStyles + '--userDefined'}
          data-user-styles={'true'}
          data-testid="styles-global-user-defined"
          dangerouslySetInnerHTML={{ __html: userStyles }}
        />
      )}
      <div className={styles.Layout} data-testid="layout">
        <Sidebar title={<SidebarTitle />} data-testid="sidebar" />
        <main className={styles.Main} data-testid="main">
          {children}
        </main>
      </div>
    </>
  )
}
