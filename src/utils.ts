export const hasWindow = typeof window !== "undefined"

export const hasDOM = typeof document !== "undefined"

export const isNullish = (o?: any): boolean => {
  return typeof o === "undefined" || o === null
}

export const isDefined = (o?: any): boolean => !isNullish(o)

export const getYPosition = (): number => {
  if (hasDOM) {
    const el = document.documentElement
    const st = Math.abs(el.scrollTop)
    if (st !== undefined) {
      return st
    }
  }
  if (hasWindow) {
    const pyo = Math.abs(window.pageYOffset)
    if (pyo !== undefined) {
      return pyo
    }
    const sy = Math.abs(window.scrollY)
    if (sy !== undefined) {
      return sy
    }
  }
  return 0
}
