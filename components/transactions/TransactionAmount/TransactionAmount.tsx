import type { Currency, TransactionType } from '@/types/api'
import { Money } from '@/components/ui'
import { cx } from '@/lib/cx'
import { isCreditType } from '../display'
import styles from './TransactionAmount.module.css'

export interface TransactionAmountProps {
  amount: number
  currency: Currency
  type: TransactionType
  /** Sizing/weight from the surrounding context; tone is owned here. */
  className?: string
}

/** Amount with credit/debit sign and tone derived from the transaction type. */
export function TransactionAmount({ amount, currency, type, className }: TransactionAmountProps) {
  const isCredit = isCreditType(type)
  return (
    <Money
      amount={amount}
      currency={currency}
      sign={isCredit ? 'credit' : 'debit'}
      className={cx(isCredit && styles.credit, className)}
    />
  )
}
