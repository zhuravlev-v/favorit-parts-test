import { requestGoods } from '@/api/partsApiClient.js'
import {
  normalizeManufacturers,
  normalizeOffers,
} from '@/api/partsNormalizers.js'
import { toRequiredString } from '@/api/partsValidation.js'

export const getManufacturers = async (article, options) => {
  const goods = await requestGoods(
    { number: toRequiredString(article) },
    options,
  )

  return normalizeManufacturers(goods)
}

export const getOffers = async (article, manufacturer, options) => {
  const goods = await requestGoods(
    {
      number: toRequiredString(article),
      brand: toRequiredString(manufacturer),
      analogues: 'on',
    },
    options,
  )

  return normalizeOffers(goods)
}
