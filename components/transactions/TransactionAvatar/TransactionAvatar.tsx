import { cx } from '@/lib/cx'
import type { TransactionType } from '@/types/api'
import { Icon } from '@/components/ui'
import { TRANSACTION_TYPE_ICONS } from '../display'
import { getInitials } from '../helpers'
import styles from './TransactionAvatar.module.css'

export interface TransactionAvatarProps {
  counterparty: string | null
  type: TransactionType
  size?: 'md' | 'xl'
  className?: string
}

/** Initials when there is a counterparty, otherwise the type icon. */
export function TransactionAvatar({ counterparty, type, size = 'md', className }: TransactionAvatarProps) {
  return (
    <span className={cx(styles.avatar, styles[size], className)} aria-hidden>
      {counterparty ? getInitials(counterparty) : <Icon name={TRANSACTION_TYPE_ICONS[type]} size={18} />}
    </span>
  )
}
