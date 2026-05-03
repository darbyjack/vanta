export const ROBOTS_BLOCKED_USER_AGENTS = [
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'Claude-Web',
  'GPTBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Applebot-Extended',
] as const

export const WORKER_BLOCKED_BOT_PATTERNS = [
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'Claude-Web',
  'GPTBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Bytespider',
  'CCBot',
  'Applebot-Extended',
] as const

export function isBlockedWorkerBot(userAgent: string | null) {
  if (!userAgent) return false

  const normalizedUserAgent = userAgent.toLowerCase()

  return WORKER_BLOCKED_BOT_PATTERNS.some((pattern) =>
    normalizedUserAgent.includes(pattern.toLowerCase()),
  )
}
