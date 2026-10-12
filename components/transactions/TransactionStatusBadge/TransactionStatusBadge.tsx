import { Badge, type BadgeTone } from '@/components/ui'

const TONES: Record<string, BadgeTone> = {
  successful: 'success',
  pending: 'warning',
  failed: 'danger',
}

const LABELS: Record<string, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
  reversed: 'Reversed',
}

export function TransactionStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={TONES[status] ?? 'neutral'} dot>
      {LABELS[status] ?? status}
    </Badge>
  )
}
