import React from 'react'
import { Link } from 'react-router-dom'

import { Library } from 'lucide-react'
import storiesConfig from 'storylite-user-config'

import styles from './SidebarTitle.module.css'

export default function SidebarTitle() {
  return (
    <div className={styles.Title}>
      <Link to={'/'}>
        <Library style={{ verticalAlign: 'middle' }} /> {storiesConfig.title}
      </Link>
    </div>
  )
}
