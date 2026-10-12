'use client'
import { Button, Card } from '@/components/ui'
import { StateMessage } from '@/components/transactions'
import styles from './page.module.css'

export default function TransactionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle}>We couldn&apos;t load your transactions.</p>
      </header>
      <Card>
        <StateMessage
          icon="alert"
          title="Something went wrong"
          text={error.message || 'Please try again.'}
          action={<Button onClick={reset}>Try again</Button>}
        />
      </Card>
    </div>
  )
}
