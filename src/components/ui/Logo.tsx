import { cn } from '@/lib/cn'

/**
 * Wordmark rendered as text rather than an exported asset so it stays crisp
 * at any size and inherits the brand token.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('text-3xl font-extrabold tracking-tight text-link', className)}>
      Prep<span className="text-navy">R</span>oute
    </span>
  )
}
