import { render, screen } from '@testing-library/react'
import { Money } from '../Money'

describe('Money', () => {
  it('formats minor units with two decimals', () => {
    render(<Money amount={120000} currency="GHS" />)
    expect(screen.getByText('GH₵1,200.00')).toBeInTheDocument()
  })

  it('prefixes credits and debits without losing decimals', () => {
    const { rerender } = render(<Money amount={2500000} currency="NGN" sign="credit" />)
    expect(screen.getByText('+₦25,000.00')).toBeInTheDocument()
    rerender(<Money amount={1549} currency="USD" sign="debit" />)
    expect(screen.getByText('-$15.49')).toBeInTheDocument()
  })

  it('groups very large amounts', () => {
    render(<Money amount={249999999999} currency="NGN" sign="credit" />)
    expect(screen.getByText('+₦2,499,999,999.99')).toBeInTheDocument()
  })
})
