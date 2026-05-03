import { isBlockedWorkerBot } from '#/lib/bots/policy'

interface BotGuardHandlerArgs {
  request: Request
  next: () => Promise<Response>
}

export function guardedPageHandlers() {
  const handler = ({ request, next }: BotGuardHandlerArgs) => {
    if (isBlockedWorkerBot(request.headers.get('user-agent'))) {
      return new Response('Forbidden', {
        status: 403,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=3600',
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    return next()
  }

  return {
    GET: handler,
    HEAD: handler,
  }
}
