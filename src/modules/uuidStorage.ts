const key = 'uuid_storage'

export const getUuid = () => {
  try {
    const json = localStorage.getItem(key)
    if (json) return JSON.parse(json)
  } catch (e) {
  }
}

export const setUuid = (fields: Record<string, unknown>) => {
  try {
    localStorage.setItem(key, JSON.stringify(fields))
  } catch (e) {
  }
}
