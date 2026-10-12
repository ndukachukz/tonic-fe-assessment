import { Skeleton } from '@/components/ui'
import styles from './TransactionDetailsSkeleton.module.css'

export function TransactionDetailsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className={styles.skeleton} aria-label="Loading transaction details">
      <div className={styles.hero}>
        <Skeleton width={64} height={64} variant="circle" />
        <Skeleton width={250} height={14} variant="rounded" />
        <Skeleton width={320} height={28} variant="rounded" />
        <Skeleton width={110} height={24} variant="pill" />
      </div>
      <div className={styles.rows}>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={styles.row}>
            <Skeleton width={120} height={12} variant="rounded" />
            <Skeleton width={200} height={12} variant="rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
