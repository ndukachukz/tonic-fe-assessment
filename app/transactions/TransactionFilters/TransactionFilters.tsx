import { Input, Select } from '@/components/ui'
import { TRANSACTION_STATUS_OPTIONS, TRANSACTION_TYPE_OPTIONS } from '../filter-options'
import styles from './TransactionFilters.module.css'

export interface TransactionFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  showClear: boolean
  onClear: () => void
}

export function TransactionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  showClear,
  onClear,
}: TransactionFiltersProps) {
  return (
    <form className={styles.filters} role="search" onSubmit={(e) => e.preventDefault()}>
      <Input
        label="Search"
        placeholder="Search by reference, name or narration"
        leadingIcon="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        fieldClassName={styles.search}
      />
      <div className={styles.selects}>
        <Select
          label="Type"
          aria-label="Filter by type"
          options={TRANSACTION_TYPE_OPTIONS}
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          fieldClassName={styles.select}
        />
        <Select
          label="Status"
          aria-label="Filter by status"
          options={TRANSACTION_STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          fieldClassName={styles.select}
        />
      </div>
      {showClear && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear filters
        </button>
      )}
    </form>
  )
}
