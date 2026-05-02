import type { ComponentProps } from 'react'
import { cn } from '#/lib/utils'

export function Button({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
