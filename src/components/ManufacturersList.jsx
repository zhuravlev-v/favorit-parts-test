import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectArticle,
  selectManufacturers,
  selectSelectedManufacturer,
} from '@/features/parts/partsSelectors.js'
import { fetchOffers } from '@/features/parts/partsSlice.js'

function ManufacturersList() {
  const dispatch = useDispatch()
  const article = useSelector(selectArticle)
  const manufacturers = useSelector(selectManufacturers)
  const selectedManufacturer = useSelector(selectSelectedManufacturer)
  const requestRef = useRef(null)

  useEffect(() => {
    requestRef.current?.abort()
    requestRef.current = null
  }, [article])

  useEffect(
    () => () => {
      requestRef.current?.abort()
    },
    [],
  )

  const handleSelect = (manufacturer) => {
    requestRef.current?.abort()
    requestRef.current = dispatch(
      fetchOffers({ article, manufacturer: manufacturer.name }),
    )
  }

  if (manufacturers.length === 0) {
    return null
  }

  return (
    <section className="mb-4" aria-labelledby="manufacturers-title">
      <h2 className="h4 mb-3" id="manufacturers-title">
        Выберите производителя
      </h2>
      <div className="list-group">
        {manufacturers.map((manufacturer) => {
          const isSelected = selectedManufacturer === manufacturer.name

          return (
            <button
              key={manufacturer.id}
              className={`list-group-item list-group-item-action${
                isSelected ? ' active' : ''
              }`}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(manufacturer)}
            >
              {manufacturer.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ManufacturersList
