import React from 'react'
import ErrorLayout from '../layouts/ErrorLayout'
import styles from './404.module.css'

export default function Error404() {
  return (
    <div className={styles.Page}>
      <h1>Error 404: Page Not Found 😵</h1>
    </div>
  )
}

export const Layout = ErrorLayout
