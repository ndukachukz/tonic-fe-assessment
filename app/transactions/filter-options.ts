import type { SelectOption } from '@/components/ui'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'

export const TRANSACTION_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All types' },
  ...Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

export const TRANSACTION_STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  ...Object.entries(TRANSACTION_STATUS_LABELS).map(([value, label]) => ({ value, label })),
  // The design lists Reversed but the API only knows successful/pending/failed;
  // selecting it yields the empty state.
  { value: 'reversed', label: 'Reversed' },
]

export const VALID_TRANSACTION_TYPES = new Set(TRANSACTION_TYPE_OPTIONS.map((o) => o.value))
export const VALID_TRANSACTION_STATUSES = new Set(TRANSACTION_STATUS_OPTIONS.map((o) => o.value))
