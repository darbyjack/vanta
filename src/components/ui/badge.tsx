import type { ComponentProps } from 'react'
import { cn } from '#/lib/utils'

const variants = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border-border text-foreground',
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'span'> & {
  variant?: keyof typeof variants
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 w-fit shrink-0 items-center justify-center whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium',
        variant === 'outline' ? 'border bg-transparent' : '',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
