import { render, screen } from '@testing-library/react'
import type { Transaction } from '@/types/api'
import { TransactionDetails } from '../TransactionDetails'

const transferOut: Transaction = {
  id: 'txn_test1',
  reference: 'ACM-48213377',
  type: 'transfer_out',
  status: 'successful',
  currency: 'GHS',
  amount: 120000,
  fee: 1200,
  narration: 'Transfer to Kwame Mensah',
  counterparty: 'Kwame Mensah',
  createdAt: '2026-10-05T10:15:00.000Z',
}

const malicious: Transaction = {
  ...transferOut,
  id: 'txn_test2',
  type: 'bill_payment',
  status: 'failed',
  currency: 'NGN',
  counterparty: null,
  narration: 'Bill payment - Spectranet <img src="x" onerror="console.warn(\'xss\')">',
}

describe('TransactionDetails', () => {
  it('renders the heading, signed amount, reference and total', () => {
    render(<TransactionDetails transaction={transferOut} />)
    expect(screen.getByText('Transfer out to Kwame Mensah')).toBeInTheDocument()
    expect(screen.getByText('-GH₵1,200.00')).toBeInTheDocument()
    expect(screen.getByText('ACM-48213377')).toBeInTheDocument()
    expect(screen.getByText('GH₵1,212.00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy reference' })).toBeInTheDocument()
  })

  it('renders unsanitised narration as text, not HTML', () => {
    const { container } = render(<TransactionDetails transaction={malicious} />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getAllByText(malicious.narration)).not.toHaveLength(0)
  })
})
