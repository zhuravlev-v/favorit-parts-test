import {
  invalidResponse,
  isPlainObject,
  toNumber,
  toRequiredString,
} from '@/api/partsValidation.js'

const collectUniqueGoods = (goods) => {
  const uniqueGoods = new Map()

  goods.forEach((item) => {
    if (!isPlainObject(item)) {
      throw invalidResponse()
    }

    const goodsId = toRequiredString(item.goodsID)

    if (!uniqueGoods.has(goodsId)) {
      uniqueGoods.set(goodsId, item)
    }

    if (item.analogues !== undefined && !Array.isArray(item.analogues)) {
      throw invalidResponse()
    }

    ;(item.analogues ?? []).forEach((analogue) => {
      if (!isPlainObject(analogue)) {
        throw invalidResponse()
      }

      const analogueId = toRequiredString(analogue.goodsID)

      if (!uniqueGoods.has(analogueId)) {
        uniqueGoods.set(analogueId, analogue)
      }
    })
  })

  return [...uniqueGoods.values()]
}

export const normalizeManufacturers = (goods) => {
  const manufacturers = new Map()

  goods.forEach((item) => {
    if (!isPlainObject(item)) {
      throw invalidResponse()
    }

    if (typeof item.brand !== 'string' || !item.brand.trim()) {
      return
    }

    const name = item.brand.trim()
    const id = name.toLocaleLowerCase('ru-RU')

    if (!manufacturers.has(id)) {
      manufacturers.set(id, { id, name })
    }
  })

  return [...manufacturers.values()]
}

export const normalizeOffers = (goods) => {
  const offers = []
  const offerIds = new Set()

  collectUniqueGoods(goods).forEach((item) => {
    if (!Array.isArray(item.warehouses)) {
      throw invalidResponse()
    }

    const goodsId = toRequiredString(item.goodsID)
    const name = toRequiredString(item.name)
    const manufacturer = toRequiredString(item.brand)
    const number = toRequiredString(item.number)

    item.warehouses.forEach((warehouse) => {
      if (!isPlainObject(warehouse)) {
        throw invalidResponse()
      }

      const warehouseId = toRequiredString(warehouse.id)
      const id = `${goodsId}:${warehouseId}`

      if (offerIds.has(id)) {
        return
      }

      offerIds.add(id)
      offers.push({
        id,
        goodsId,
        name,
        manufacturer,
        number,
        warehouseId,
        warehouseCode:
          typeof warehouse.code === 'string' ? warehouse.code.trim() : '',
        price: toNumber(warehouse.price),
        stock: toNumber(warehouse.stock),
        shipmentDate: warehouse.shipmentDate ?? null,
        ownWarehouse: warehouse.own === true,
      })
    })
  })

  return offers
}
