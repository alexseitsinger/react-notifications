let cache: string[] = []

export const hasRendered = (n: string): boolean => {
  return cache.includes(n)
}

export const addRendered = (n: string): void => {
  if (hasRendered(n)) {
    return
  }
  cache = [...cache, n]
}

export const removeRendered = (n: string): void => {
  cache = cache.filter(s => s !== n)
}

export const clearRendered = (): void => {
  cache = []
}
