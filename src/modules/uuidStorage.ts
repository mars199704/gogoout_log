const key = 'uuid_storage'

export const get = () => {
  try {
    const json = localStorage.getItem(key)
    if (json) return JSON.parse(json)
  } catch (e) {
  }
}

export const set = (fields: Record<string, unknown>) => {
  try {
    localStorage.setItem(key, JSON.stringify(fields))
  } catch (e) {
  }
}
