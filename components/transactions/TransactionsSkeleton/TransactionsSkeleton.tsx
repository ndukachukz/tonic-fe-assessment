import styles from './TransactionsSkeleton.module.css'

export function TransactionsSkeleton({ rows = 8, label = true }: { rows?: number; label?: boolean }) {
  return (
    <div
      className={styles.skeleton}
      aria-label={label ? 'Loading transactions' : undefined}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.row}>
          <span className={styles.avatar} />
          <span className={styles.lines}>
            <span />
            <span />
          </span>
        </div>
      ))}
    </div>
  )
}
