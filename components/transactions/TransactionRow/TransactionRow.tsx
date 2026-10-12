import type { Transaction } from '@/types/api'
import { Icon } from '@/components/ui'
import { formatDateTime, formatMoney, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusDot } from '../StatusDot/StatusDot'
import { TRANSACTION_TYPE_ICONS } from '../display'
import { TransactionAmount } from '../TransactionAmount/TransactionAmount'
import styles from './TransactionRow.module.css'

export interface TransactionRowProps {
  transaction: Transaction
  onSelect?: (transaction: Transaction) => void
}

export function TransactionRow({ transaction: tx, onSelect }: TransactionRowProps) {
  return (
    <button type="button" className={styles.row} onClick={() => onSelect?.(tx)}>
      <span className={styles.icon}>
        <Icon name={TRANSACTION_TYPE_ICONS[tx.type]} size={18} />
      </span>
      <span className={styles.main}>
        <span className={styles.title}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
        <span className={styles.narration}>{tx.narration}</span>
      </span>
      <StatusDot status={tx.status} />
      <span className={styles.end}>
        <TransactionAmount
          amount={tx.amount}
          currency={tx.currency}
          type={tx.type}
          className={styles.amount}
        />
        <span className={styles.meta}>
          {formatDateTime(tx.createdAt)}
          {tx.fee > 0 && ` · Fee ${formatMoney(tx.fee, tx.currency)}`}
        </span>
      </span>
    </button>
  )
}
