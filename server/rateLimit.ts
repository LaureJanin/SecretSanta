// Limitation de tentatives en mémoire (une seule instance du backend : suffisant ici)
type Entry = { count: number; resetAt: number }
const buckets = new Map<string, Entry>()

const getEntry = (key: string): Entry | undefined => {
  const entry = buckets.get(key)
  if (entry && entry.resetAt <= Date.now()) {
    buckets.delete(key)
    return undefined
  }
  return entry
}

export const isRateLimited = (key: string, max: number): boolean =>
  (getEntry(key)?.count ?? 0) >= max

export const recordHit = (key: string, windowMs: number): void => {
  const entry = getEntry(key)
  if (entry) {
    entry.count++
  } else {
    buckets.set(key, { count: 1, resetAt: Date.now() + windowMs })
  }
}

export const clearHits = (key: string): void => {
  buckets.delete(key)
}

// Nettoyage régulier pour que la table ne grossisse pas indéfiniment
setInterval(() => {
  for (const key of buckets.keys()) getEntry(key)
}, 10 * 60 * 1000).unref()
