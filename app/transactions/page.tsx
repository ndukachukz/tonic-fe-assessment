'use client'
import { Suspense } from 'react'
import {
  StateMessage,
  TransactionDetails,
  TransactionDetailsSkeleton,
  TransactionsSkeleton,
} from '@/components/transactions'
import { Button, Card, Drawer } from '@/components/ui'
import { TRANSACTIONS_PAGE_SIZE } from './constants'
import { useTransactionParams } from './hooks/use-transaction-params'
import { useTransactionDetails, useTransactionList } from './hooks/use-transactions'
import styles from './page.module.css'
import { TransactionFilters } from './TransactionFilters/TransactionFilters'
import { TransactionList } from './TransactionList/TransactionList'
import { TransactionsPagination } from './TransactionsPagination/TransactionsPagination'

function TransactionsFallback() {
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

function TransactionsContent() {
  const params = useTransactionParams()
  const { q, type, status, page, txnId, scenario, hasActiveFilters } = params
  const list = useTransactionList({ q, type, status, page, scenario })
  const cachedDetails = txnId ? (list.transactions?.find((tx) => tx.id === txnId) ?? null) : null
  const details = useTransactionDetails(txnId, cachedDetails)

  const showSkeleton = list.isLoading && list.transactions === undefined
  const stale = list.isLoading && list.transactions !== undefined
  const total = list.meta?.total ?? 0
  const subtitle = showSkeleton ? 'Loading transactions…' : `${total} transaction${total === 1 ? '' : 's'}`
  const showPagination = !showSkeleton && !list.error
  const showDetailsNotFound = !details.isLoading && !details.error && !details.details

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle} aria-live="polite">
          {subtitle}
        </p>
      </header>

      <TransactionFilters
        search={params.searchInput}
        onSearchChange={params.setSearchInput}
        type={type}
        onTypeChange={(value) => params.updateParams({ type: value || undefined, page: undefined })}
        status={status}
        onStatusChange={(value) => params.updateParams({ status: value || undefined, page: undefined })}
        showClear={hasActiveFilters}
        onClear={params.clearFilters}
      />

      <TransactionList
        transactions={list.transactions ?? []}
        selectedId={txnId}
        stale={stale}
        isLoading={list.isLoading}
        error={list.error || null}
        hasActiveFilters={hasActiveFilters}
        onSelect={(tx) => params.updateParams({ txn: tx.id }, 'push')}
        onRetry={list.retry}
        onClearFilters={params.clearFilters}
      />

      {showPagination && (
        <TransactionsPagination
          page={page}
          totalPages={list.meta?.totalPages ?? 0}
          total={total}
          limit={TRANSACTIONS_PAGE_SIZE}
          onPage={params.goToPage}
        />
      )}

      <Drawer
        open={txnId !== null}
        title="Transaction details"
        onClose={() => params.updateParams({ txn: undefined }, 'replace')}
      >
        {details.isLoading && <TransactionDetailsSkeleton />}
        {!details.isLoading && details.error && (
          <StateMessage
            icon="search"
            title="Transaction not found"
            text={'It may have been removed, or the link is wrong.'}
            action={
              <Button variant="secondary" onClick={() => params.updateParams({ txn: undefined }, 'replace')}>
                Back to transactions
              </Button>
            }
          />
        )}
        {!details.isLoading && !details.error && details.details && (
          <TransactionDetails transaction={details.details} />
        )}
        {showDetailsNotFound && (
          <StateMessage
            icon="search"
            title="Transaction not found"
            text="This transaction may have been removed or the link is incorrect."
          />
        )}
      </Drawer>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsFallback />}>
      <TransactionsContent />
    </Suspense>
  )
}
