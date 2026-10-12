import { useMemo } from 'react'
import type { Transaction } from '@/types/api'
import {
  TransactionAmount,
  TransactionAvatar,
  TransactionStatusBadge,
  groupTransactionsByDay,
} from '@/components/transactions'
import { TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { formatTime } from '@/lib/format'
import styles from './TransactionList.module.css'

export interface TransactionListProps {
  transactions: Transaction[]
  selectedId: string | null
  stale: boolean
  onSelect: (transaction: Transaction) => void
}

export function TransactionList({ transactions, selectedId, stale, onSelect }: TransactionListProps) {
  const groups = useMemo(() => groupTransactionsByDay(transactions), [transactions])

  return (
    <ul className={stale ? `${styles.list} ${styles.stale}` : styles.list} aria-busy={stale}>
      {groups.map((group, groupIndex) => (
        <li key={group.key} className={groupIndex === 0 ? undefined : styles.groupItem}>
          <h2 className={styles.group}>{group.label}</h2>
          <ul>
            {group.items.map((tx) => (
              <li key={tx.id} className={styles.rowItem}>
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => onSelect(tx)}
                  aria-current={selectedId === tx.id || undefined}
                >
                  <TransactionAvatar counterparty={tx.counterparty} type={tx.type} />
                  <span className={styles.main}>
                    <span className={styles.rowTitle}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
                    <span className={styles.narration}>{tx.narration}</span>
                  </span>
                  <span className={styles.trailing}>
                    <TransactionStatusBadge status={tx.status} />
                    <span className={styles.figures}>
                      <TransactionAmount
                        amount={tx.amount}
                        currency={tx.currency}
                        type={tx.type}
                        className={styles.amount}
                      />
                      <span className={styles.time}>{formatTime(tx.createdAt)}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
