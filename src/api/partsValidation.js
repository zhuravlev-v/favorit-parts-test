export const invalidResponse = () =>
  new Error('API вернул данные в неожиданном формате.')

export const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export const isEmptyObject = (value) =>
  isPlainObject(value) && Object.keys(value).length === 0

export const toRequiredString = (value) => {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw invalidResponse()
  }

  const normalizedValue = String(value).trim()

  if (!normalizedValue) {
    throw invalidResponse()
  }

  return normalizedValue
}

export const toNumber = (value) => {
  const normalizedValue = Number(value)

  if (!Number.isFinite(normalizedValue)) {
    throw invalidResponse()
  }

  return normalizedValue
}
