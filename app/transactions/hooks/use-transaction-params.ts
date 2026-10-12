'use client'
import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { VALID_TRANSACTION_STATUSES, VALID_TRANSACTION_TYPES } from '../filter-options'

export interface TransactionParams {
  q: string
  type: string
  status: string
  page: number
  txnId: string | null
  scenario: string
  hasActiveFilters: boolean
  searchInput: string
  setSearchInput: (value: string) => void
  updateParams: (overrides: Record<string, string | undefined>, method?: 'push' | 'replace') => void
  clearFilters: () => void
  goToPage: (page: number) => void
}

/** URL is the source of truth: parse/validate params and navigate without losing place. */
export function useTransactionParams(): TransactionParams {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const rawType = searchParams.get('type') ?? ''
  const rawStatus = searchParams.get('status') ?? ''
  const type = VALID_TRANSACTION_TYPES.has(rawType) ? rawType : ''
  const status = VALID_TRANSACTION_STATUSES.has(rawStatus) ? rawStatus : ''
  const pageParam = Number(searchParams.get('page') ?? '1')
  const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1
  const txnId = searchParams.get('txn')
  const scenario = searchParams.get('__scenario') ?? ''

  const updateParams = useCallback(
    (overrides: Record<string, string | undefined>, method: 'push' | 'replace' = 'push') => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '') params.delete(key)
        else params.set(key, value)
      }
      const qs = params.toString()
      router[method](qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // Render-phase sync (no setState-in-effect): adopt external q changes, e.g. Back.
  const [searchInput, setSearchInput] = useState(q)
  const [prevQ, setPrevQ] = useState(q)
  if (q !== prevQ) {
    setPrevQ(q)
    setSearchInput(q)
  }

  useEffect(() => {
    if (searchInput === q) return
    const timer = setTimeout(() => {
      updateParams({ q: searchInput.trim() || undefined, page: undefined }, 'replace')
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput, q, updateParams])

  const clearFilters = useCallback(() => {
    setSearchInput('')
    updateParams({ q: undefined, type: undefined, status: undefined, page: undefined }, 'push')
  }, [updateParams])

  const goToPage = useCallback(
    (next: number) => {
      updateParams({ page: next <= 1 ? undefined : String(next) }, 'push')
    },
    [updateParams]
  )

  return {
    q,
    type,
    status,
    page,
    txnId,
    scenario,
    hasActiveFilters: q !== '' || type !== '' || status !== '',
    searchInput,
    setSearchInput,
    updateParams,
    clearFilters,
    goToPage,
  }
}
