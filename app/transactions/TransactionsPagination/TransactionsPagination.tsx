import { pageRangeText, paginationRange } from '@/components/transactions'
import { Icon } from '@/components/ui'
import styles from './TransactionsPagination.module.css'

export interface TransactionsPaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPage: (page: number) => void
}

export function TransactionsPagination({
  page,
  totalPages,
  total,
  limit,
  onPage,
}: TransactionsPaginationProps) {
  if (total <= 0) return null

  return (
    <div className={styles.footer}>
      <p className={styles.showing}>{pageRangeText(page, limit, total)}</p>
      <nav className={styles.pages} aria-label="Pagination">
        <button
          type="button"
          className={styles.pageButton}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Go to previous page"
        >
          <Icon name="chevron-left" size={16} />
          <span className={styles.previousFull}>Previous</span>
          <span className={styles.previousShort}>Prev</span>
        </button>

        <p className={styles.compact} aria-live="polite">
          Page {page} of {totalPages}
        </p>

        <span className={styles.numbers}>
          {paginationRange(page, totalPages).map((item, i) =>
            item === '…' ? (
              <span key={`gap-${i}`} className={styles.ellipsis} aria-hidden>
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={item === page ? `${styles.number} ${styles.current}` : styles.number}
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPage(item)}
              >
                {item}
              </button>
            )
          )}
        </span>

        <button
          type="button"
          className={styles.pageButton}
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          aria-label="Go to next page"
        >
          Next
          <Icon name="chevron-right" size={16} />
        </button>
      </nav>
    </div>
  )
}
