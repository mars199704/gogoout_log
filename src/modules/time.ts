export const moreThanOneDay = (time: number): boolean => {
  const now: number = new Date().getTime()
  const diff = (now - time) / 1000 / 3600 / 24
  if (diff < 1) return false
  return true
}
