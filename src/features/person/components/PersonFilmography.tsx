import { Badge } from '#/components/ui/Badge'
import { mediaHref, titleFor, yearFrom } from '#/lib/tmdb/normalize'
import type { TmdbCombinedCredit } from '#/lib/tmdb/types'

function creditDate(credit: TmdbCombinedCredit) {
  return credit.release_date ?? credit.first_air_date ?? ''
}

export function PersonFilmography({
  credits,
}: {
  credits: TmdbCombinedCredit[]
}) {
  const unique = new Map<string, TmdbCombinedCredit>()
  for (const credit of credits) unique.set(`${credit.media_type}-${credit.id}`, credit)

  const items = [...unique.values()]
    .filter((credit) => titleFor(credit))
    .sort((a, b) => creditDate(b).localeCompare(creditDate(a)))
    .slice(0, 80)

  if (!items.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Filmography</h2>
      <div className="divide-y divide-border rounded-md border border-border bg-card">
        {items.map((credit) => {
          const title = titleFor(credit)

          return (
            <a
              key={`${credit.media_type}-${credit.id}`}
              href={mediaHref(credit.media_type, credit.id, title)}
              className="grid gap-2 p-3 no-underline hover:bg-muted/50 sm:grid-cols-[80px_1fr_auto]"
            >
              <span className="text-sm text-muted-foreground">
                {yearFrom(creditDate(credit)) ?? 'Soon'}
              </span>
              <span>
                <span className="font-medium text-foreground">{title}</span>
                {credit.character || credit.job ? (
                  <span className="ml-2 text-sm text-muted-foreground">
                    as {credit.character ?? credit.job}
                  </span>
                ) : null}
              </span>
              <Badge variant="secondary" className="w-fit rounded uppercase">
                {credit.media_type}
              </Badge>
            </a>
          )
        })}
      </div>
    </section>
  )
}
