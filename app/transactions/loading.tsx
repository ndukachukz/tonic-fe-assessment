import { Card } from '@/components/ui'
import { TransactionsSkeleton } from '@/components/transactions'
import styles from './page.module.css'

export default function TransactionsLoading() {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle}>Loading transactions…</p>
      </header>
      <Card padding="none">
        <TransactionsSkeleton label={false} />
      </Card>
    </div>
  )
}
