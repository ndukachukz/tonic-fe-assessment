'use client'
import { Icon, Money } from '@/components/ui'
import { formatDateTime, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import type { Transaction } from '@/types/api'
import { useState } from 'react'
import { TransactionAmount } from '../TransactionAmount/TransactionAmount'
import { TransactionAvatar } from '../TransactionAvatar/TransactionAvatar'
import { TransactionStatusBadge } from '../TransactionStatusBadge/TransactionStatusBadge'
import styles from './TransactionDetails.module.css'

function headingFor(tx: Transaction): string {
  if (tx.counterparty) {
    if (tx.type === 'transfer_in') return `Transfer in from ${tx.counterparty}`
    if (tx.type === 'transfer_out') return `Transfer out to ${tx.counterparty}`
    return `${TRANSACTION_TYPE_LABELS[tx.type]} - ${tx.counterparty}`
  }
  return tx.narration
}

function CopyReferenceButton({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false)

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      className={styles.copy}
      onClick={copyReference}
      aria-label={copied ? 'Reference copied' : 'Copy reference'}
    >
      <Icon name={'copy'} color={copied ? 'green' : undefined} size={16} />
    </button>
  )
}

export function TransactionDetails({ transaction: tx }: { transaction: Transaction }) {
  const total = tx.amount + tx.fee

  return (
    <div className={styles.details}>
      <div className={styles.hero}>
        <TransactionAvatar counterparty={tx.counterparty} type={tx.type} size="xl" />
        <p className={styles.heading}>{headingFor(tx)}</p>
        <p className={styles.amount}>
          <TransactionAmount amount={tx.amount} currency={tx.currency} type={tx.type} />
        </p>
        <TransactionStatusBadge status={tx.status} />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Details</h3>

        <dl className={styles.rows}>
          <div className={styles.row}>
            <dt>Reference</dt>

            <dd className={styles.reference}>
              <span>{tx.reference}</span>
              <CopyReferenceButton reference={tx.reference} />
            </dd>
          </div>

          <div className={styles.row}>
            <dt>Date</dt>
            <dd>{formatDateTime(tx.createdAt)}</dd>
          </div>
          <div className={styles.row}>
            <dt>Type</dt>
            <dd>{TRANSACTION_TYPE_LABELS[tx.type]}</dd>
          </div>
          <div className={styles.row}>
            <dt>Counterparty</dt>
            <dd>{tx.counterparty ?? '—'}</dd>
          </div>
          <div className={styles.row}>
            <dt>Narration</dt>
            <dd className={styles.narration}>{tx.narration}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Summary</h3>
        <dl className={styles.rows}>
          <div className={styles.row}>
            <dt>Amount</dt>
            <dd>
              <Money amount={tx.amount} currency={tx.currency} />
            </dd>
          </div>
          <div className={styles.row}>
            <dt>Fee</dt>
            <dd>
              <Money amount={tx.fee} currency={tx.currency} />
            </dd>
          </div>
        </dl>
      </div>
      <div className={styles.total}>
        <span>Total</span>
        <Money amount={total} currency={tx.currency} />
      </div>
    </div>
  )
}
