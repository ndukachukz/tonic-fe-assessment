import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './Skeleton.module.css'

export interface SkeletonProps {
  width?: number | string
  height?: number | string
  variant?: 'text' | 'circle' | 'rounded' | 'pill'
  className?: string
}

function toSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/** Animated placeholder block. Compose into row / card / details skeletons. */
export function Skeleton({ width, height, variant = 'text', className }: SkeletonProps) {
  const style: CSSProperties = {
    width: toSize(width),
    height: toSize(height),
  }
  return <span aria-hidden="true" className={cx(styles.skeleton, styles[variant], className)} style={style} />
}
