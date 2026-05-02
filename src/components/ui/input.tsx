import type { ComponentProps } from 'react'
import { cn } from '#/lib/utils'

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
