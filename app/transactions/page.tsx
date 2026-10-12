'use client'
import { Suspense } from 'react'
import { Button, Card, Drawer } from '@/components/ui'
import { StateMessage, TransactionDetails, TransactionsSkeleton } from '@/components/transactions'
import { TransactionFilters } from './TransactionFilters/TransactionFilters'
import { TransactionList } from './TransactionList/TransactionList'
import { TransactionsPagination } from './TransactionsPagination/TransactionsPagination'
import { TRANSACTIONS_PAGE_SIZE } from './constants'
import { useTransactionParams } from './hooks/use-transaction-params'
import { useTransactionDetails, useTransactionList } from './hooks/use-transactions'
import styles from './page.module.css'

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
  const isEmpty = !showSkeleton && !list.error && (list.transactions ?? []).length === 0

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

      {showSkeleton && (
        <Card padding="none">
          <TransactionsSkeleton />
        </Card>
      )}

      {!showSkeleton && list.error && (
        <Card>
          <StateMessage
            icon="alert"
            title="Something went wrong"
            text={list.error}
            action={<Button onClick={list.retry}>Try again</Button>}
          />
        </Card>
      )}

      {isEmpty && (
        <Card>
          <StateMessage
            icon="inbox"
            title={hasActiveFilters ? 'No matching transactions' : 'No transactions yet'}
            text={
              hasActiveFilters
                ? 'Try a different search or clear your filters.'
                : 'Transactions will appear here once there is activity.'
            }
            action={
              hasActiveFilters && (
                <Button variant="secondary" onClick={params.clearFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        </Card>
      )}

      {!showSkeleton && !list.error && (list.transactions ?? []).length > 0 && (
        <Card padding="none">
          <TransactionList
            transactions={list.transactions ?? []}
            selectedId={txnId}
            stale={stale}
            onSelect={(tx) => params.updateParams({ txn: tx.id }, 'push')}
          />
        </Card>
      )}

      {!showSkeleton && !list.error && (
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
        {details.isLoading && <p className={styles.drawerMessage}>Loading details…</p>}
        {!details.isLoading && details.error && (
          <StateMessage
            icon="alert"
            title="Couldn't load this transaction"
            text={details.error}
            action={<Button onClick={details.retry}>Try again</Button>}
          />
        )}
        {!details.isLoading && !details.error && details.details && (
          <TransactionDetails transaction={details.details} />
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
