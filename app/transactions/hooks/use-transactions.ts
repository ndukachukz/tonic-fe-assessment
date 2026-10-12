'use client'
import { useEffect, useRef, useState } from 'react'
import type { PageMeta, Transaction, TransactionStatus } from '@/types/api'
import { isApiError } from '@/lib/api/client'
import { getTransaction, getTransactions } from '@/lib/api/endpoints'
import { TRANSACTIONS_PAGE_SIZE } from '../constants'

export interface TransactionListQuery {
  q: string
  type: string
  status: string
  page: number
  scenario: string
}

export interface TransactionListResult {
  transactions: Transaction[] | undefined
  meta: PageMeta | null
  error: string
  isLoading: boolean
  retry: () => void
}

/** Paginated, filtered history. Stale data stays visible while the next page loads. */
export function useTransactionList({ q, type, status, page, scenario }: TransactionListQuery) {
  interface Snapshot {
    key: string
    transactions: Transaction[]
    meta: PageMeta | null
    error: string
  }

  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const requestRef = useRef(0)
  const key = `${q}|${type}|${status}|${page}|${scenario}|${retryCount}`

  useEffect(() => {
    const id = ++requestRef.current
    getTransactions({
      page,
      limit: TRANSACTIONS_PAGE_SIZE,
      ...(q ? { q } : {}),
      ...(type ? { type: type as Transaction['type'] } : {}),
      ...(status ? { status: status as TransactionStatus } : {}),
    })
      .then((res) => {
        if (requestRef.current !== id) return
        if (isApiError(res)) {
          setSnapshot({ key, transactions: [], meta: null, error: res.error.message })
        } else {
          setSnapshot({ key, transactions: res.data, meta: res.meta ?? null, error: '' })
        }
      })
      .catch((err: unknown) => {
        if (requestRef.current !== id) return
        setSnapshot({
          key,
          transactions: [],
          meta: null,
          error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const isCurrent = snapshot?.key === key
  return {
    transactions: snapshot?.transactions,
    meta: snapshot?.meta ?? null,
    error: isCurrent ? (snapshot?.error ?? '') : '',
    isLoading: !isCurrent,
    retry: () => setRetryCount((c) => c + 1),
  }
}

export interface TransactionDetailsResult {
  details: Transaction | null
  isLoading: boolean
  error: string
  retry: () => void
}

/** Single transaction: list cache first (instant + offline-tolerant), fetch on deep link. */
export function useTransactionDetails(
  txnId: string | null,
  cached: Transaction | null
): TransactionDetailsResult {
  const [fetched, setFetched] = useState<{
    key: string
    transaction: Transaction | null
    error: string
  } | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const key = txnId ? `${txnId}|${retryCount}` : null

  useEffect(() => {
    if (!txnId || !key || cached) return
    let cancelled = false
    getTransaction(txnId)
      .then((res) => {
        if (cancelled) return
        if (isApiError(res)) setFetched({ key, transaction: null, error: res.error.message })
        else setFetched({ key, transaction: res.data, error: '' })
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setFetched({
            key,
            transaction: null,
            error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
          })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cached?.id])

  const current = key && fetched?.key === key ? fetched : null
  return {
    details: cached ?? current?.transaction ?? null,
    isLoading: !!txnId && !cached && !current,
    error: current?.error ?? '',
    retry: () => setRetryCount((c) => c + 1),
  }
}
