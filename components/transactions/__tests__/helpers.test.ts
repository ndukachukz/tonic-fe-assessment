import { getInitials, groupTransactionsByDay, pageRangeText, paginationRange } from '../helpers'

describe('getInitials', () => {
  it('uses the first letters of the first two names', () => {
    expect(getInitials('Kwame Mensah')).toBe('KM')
    expect(getInitials('Ada Okafor')).toBe('AO')
  })

  it('splits hyphenated names', () => {
    expect(getInitials('Okonkwo-Adeyemi Logistics')).toBe('OA')
  })

  it('falls back to two letters for single names', () => {
    expect(getInitials('Netflix')).toBe('NE')
  })
})

describe('groupTransactionsByDay', () => {
  const now = new Date('2026-10-08T12:00:00.000Z')
  const tx = (id: string, createdAt: string) => ({
    id,
    reference: `ACM-${id}`,
    type: 'deposit',
    status: 'successful',
    currency: 'NGN',
    amount: 100,
    fee: 0,
    narration: 'Wallet top-up via bank transfer',
    counterparty: null,
    createdAt,
  })

  it('labels today and yesterday groups', () => {
    const groups = groupTransactionsByDay(
      [
        tx('1', '2026-10-08T09:00:00.000Z'),
        tx('2', '2026-10-07T21:00:00.000Z'),
        tx('3', '2026-10-05T10:15:00.000Z'),
      ] as never,
      now
    )
    expect(groups.map((g) => g.label)).toEqual(['TODAY', 'YESTERDAY', 'MON, 5 OCT 2026'])
    expect(groups[0].items).toHaveLength(1)
  })
})

describe('paginationRange', () => {
  it('matches the design for the first page of many', () => {
    expect(paginationRange(1, 12)).toEqual([1, 2, 3, '…', 12])
  })

  it('lists every page when there are few', () => {
    expect(paginationRange(2, 3)).toEqual([1, 2, 3])
  })

  it('windows around the current page', () => {
    expect(paginationRange(6, 12)).toEqual([1, '…', 5, 6, 7, '…', 12])
    expect(paginationRange(11, 12)).toEqual([1, '…', 10, 11, 12])
  })
})

describe('pageRangeText', () => {
  it('describes the visible range', () => {
    expect(pageRangeText(1, 20, 237)).toBe('Showing 1–20 of 237')
    expect(pageRangeText(12, 20, 237)).toBe('Showing 221–237 of 237')
    expect(pageRangeText(1, 20, 0)).toBe('Showing 0 of 0')
  })
})
