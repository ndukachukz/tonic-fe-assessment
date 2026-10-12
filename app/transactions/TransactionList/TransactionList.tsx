import { useMemo } from 'react'
import type { Transaction } from '@/types/api'
import { Button, Card } from '@/components/ui'
import {
  StateMessage,
  TransactionAmount,
  TransactionAvatar,
  TransactionStatusBadge,
  TransactionsSkeleton,
  groupTransactionsByDay,
} from '@/components/transactions'
import { TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { formatTime } from '@/lib/format'
import styles from './TransactionList.module.css'

export interface TransactionListProps {
  transactions: Transaction[]
  selectedId: string | null
  stale: boolean
  isLoading?: boolean
  error?: string | null
  hasActiveFilters?: boolean
  onSelect: (transaction: Transaction) => void
  onRetry?: () => void
  onClearFilters?: () => void
}

export function TransactionList({
  transactions,
  selectedId,
  stale,
  isLoading = false,
  error = null,
  hasActiveFilters = false,
  onSelect,
  onRetry,
  onClearFilters,
}: TransactionListProps) {
  const groups = useMemo(() => groupTransactionsByDay(transactions), [transactions])

  if (isLoading && transactions.length === 0) {
    return (
      <Card padding="none">
        <TransactionsSkeleton />
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <StateMessage
          icon="alert"
          title="We couldn't load your transactions"
          text="Check your connection and try again."
          action={
            onRetry && (
              <Button onClick={onRetry} iconLeft="refresh">
                Try again
              </Button>
            )
          }
        />
      </Card>
    )
  }

  if (transactions.length === 0) {
    if (hasActiveFilters) {
      return (
        <Card>
          <StateMessage
            icon="search"
            title="No transactions match your filters"
            text="Try a different search term or remove some filters."
            action={
              onClearFilters && (
                <Button variant="secondary" onClick={onClearFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        </Card>
      )
    }

    return (
      <Card>
        <StateMessage
          icon="inbox"
          title="No transactions yet"
          text="When you add money, send a transfer or pay with your card, it will show up here."
        />
      </Card>
    )
  }

  return (
    <Card padding="none">
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
    </Card>
  )
}
