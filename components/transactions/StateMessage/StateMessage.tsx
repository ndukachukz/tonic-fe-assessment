import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui'
import styles from './StateMessage.module.css'

export interface StateMessageProps {
  icon: IconName
  title: string
  text: string
  action?: ReactNode
}

/** Centered icon + title + text + optional action for empty/error states. */
export function StateMessage({ icon, title, text, action }: StateMessageProps) {
  return (
    <div className={styles.state}>
      <Icon name={icon} size={24} label={title} />
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
      {action}
    </div>
  )
}
