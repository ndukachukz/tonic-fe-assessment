import type { TransactionType } from '@/types/api'
import type { IconName } from '@/components/ui'

/** Single source of truth for per-type presentation. */
export const TRANSACTION_TYPE_ICONS: Record<TransactionType, IconName> = {
  deposit: 'arrow-down-left',
  transfer_in: 'arrow-down-left',
  withdrawal: 'arrow-up-right',
  transfer_out: 'arrow-up-right',
  conversion: 'swap',
  card_payment: 'card',
  bill_payment: 'receipt',
}

const CREDIT_TYPES: ReadonlySet<TransactionType> = new Set(['deposit', 'transfer_in', 'conversion'])

/** Credits render green with a + prefix; everything else is a black debit. */
export function isCreditType(type: TransactionType): boolean {
  return CREDIT_TYPES.has(type)
}
