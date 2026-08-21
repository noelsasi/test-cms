import { cn } from '@/lib/cn'

/**
 * Brand wordmark. Self-hosted from `public/` rather than hotlinked from
 * preproute.com, so the shell doesn't block on a third-party host and keeps
 * rendering if that URL moves. Source:
 * https://www.preproute.com/logo/light-theme-logo.webp
 *
 * Sized by height — the artwork is roughly 4:1, so a width-based class would
 * distort it.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.webp"
      alt="PrepRoute"
      /* Intrinsic size lets the browser reserve the box and avoid a layout
         shift before the image decodes. */
      width={1577}
      height={387}
      className={cn('h-8 w-auto', className)}
    />
  )
}
