import type { Transaction } from '@/types/api'
import { formatDate } from '@/lib/format'

/** Initials for avatar circles, e.g. "Kwame Mensah" -> "KM". */
export function getInitials(name: string): string {
  const parts = name.split(/[\s\u2010-\u2015\-&/]+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export interface TransactionGroup {
  key: string
  label: string
  items: Transaction[]
}

const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

/** Group newest-first transactions under TODAY / YESTERDAY / date labels. */
export function groupTransactionsByDay(
  transactions: Transaction[],
  now: Date = new Date()
): TransactionGroup[] {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfToday.getDate() - 1)

  const todayKey = dayKey(startOfToday)
  const yesterdayKey = dayKey(startOfYesterday)

  const groups = new Map<string, TransactionGroup>()
  for (const tx of transactions) {
    const date = new Date(tx.createdAt)
    const key = dayKey(date)
    let label: string
    if (key === todayKey) label = 'TODAY'
    else if (key === yesterdayKey) label = 'YESTERDAY'
    else label = formatDate(tx.createdAt).toUpperCase()

    const group = groups.get(key)
    if (group) group.items.push(tx)
    else groups.set(key, { key, label, items: [tx] })
  }
  return [...groups.values()]
}

/** Page numbers with ellipsis, e.g. current 1 of 12 -> [1, 2, 3, '…', 12]. */
export function paginationRange(current: number, total: number): Array<number | '…'> {
  if (total <= 0) return []
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, '…', total]
  if (current >= total - 2) return [1, '…', total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

/** "Showing 1–20 of 237" range for the current page. */
export function pageRangeText(page: number, limit: number, total: number): string {
  if (total === 0) return 'Showing 0 of 0'
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  return `Showing ${from}–${to} of ${total}`
}
