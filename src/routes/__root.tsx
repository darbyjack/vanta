import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import Header from '../components/Header'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vanta',
      },
      {
        name: 'description',
        content:
          'A fast, read-only movie and TV reference powered by TMDB.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased [overflow-wrap:anywhere]">
        <Header />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
