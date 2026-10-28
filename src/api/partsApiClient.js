import {
  invalidResponse,
  isEmptyObject,
  isPlainObject,
} from '@/api/partsValidation.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

const API_ERROR_MESSAGES = {
  'Empty key!': 'Не указан ключ доступа к API.',
  'Invalid key client!': 'Ключ доступа к API недействителен.',
  'Empty number goods!': 'Не указан артикул детали.',
  'Request quota exceeded!': 'Превышен лимит запросов к API.',
}

const getApiErrorMessage = (error) => {
  const knownMessages = Object.entries(API_ERROR_MESSAGES)
    .filter(([apiError]) => error.includes(apiError))
    .map(([, message]) => message)

  return knownMessages.length > 0
    ? [...new Set(knownMessages)].join(' ')
    : `Ошибка API: ${error}`
}

const buildUrl = (params) => {
  if (!API_BASE_URL) {
    throw new Error('Не задан VITE_API_BASE_URL.')
  }

  if (!API_KEY) {
    throw new Error('Не задан VITE_API_KEY.')
  }

  let url

  try {
    url = new URL(API_BASE_URL)
  } catch {
    throw new Error('VITE_API_BASE_URL содержит некорректный URL.')
  }

  url.search = new URLSearchParams({ key: API_KEY, ...params })

  return url
}

export const requestGoods = async (params, { signal } = {}) => {
  const url = buildUrl(params)
  let response

  try {
    response = await fetch(url, { signal })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error
    }

    throw new Error('Не удалось подключиться к API. Проверьте соединение.')
  }

  if (!response.ok) {
    throw new Error(`API вернул ошибку HTTP ${response.status}.`)
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error('API вернул некорректный JSON.')
  }

  if (!isPlainObject(data)) {
    throw invalidResponse()
  }

  if (typeof data.error === 'string' && data.error.trim()) {
    throw new Error(getApiErrorMessage(data.error))
  }

  if (!Array.isArray(data.goods)) {
    throw invalidResponse()
  }

  if (data.goods.length === 1 && isEmptyObject(data.goods[0])) {
    return []
  }

  return data.goods
}
