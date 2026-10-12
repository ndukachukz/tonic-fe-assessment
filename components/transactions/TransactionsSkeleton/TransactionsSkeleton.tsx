import { Skeleton } from '@/components/ui'
import styles from './TransactionsSkeleton.module.css'

export function TransactionsSkeleton({ rows = 6, label = true }: { rows?: number; label?: boolean }) {
  return (
    <div
      className={styles.skeleton}
      aria-label={label ? 'Loading transactions' : undefined}
      aria-hidden={label ? undefined : true}
    >
      <div className={styles.group}>
        <Skeleton width={120} height={12} variant="rounded" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.row}>
          <Skeleton width={40} height={40} variant="circle" />
          <span className={styles.lines}>
            <Skeleton width="34%" height={12} variant="rounded" />
            <Skeleton width="72%" height={12} variant="rounded" />
          </span>
          <span className={styles.trailing}>
            <Skeleton width={110} height={12} variant="rounded" />
            <Skeleton width={52} height={12} variant="pill" />
          </span>
        </div>
      ))}
    </div>
  )
}
