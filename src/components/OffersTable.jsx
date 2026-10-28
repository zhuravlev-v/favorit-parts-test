import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDispatch, useSelector } from 'react-redux'
import EmptyState from '@/components/EmptyState.jsx'
import ErrorMessage from '@/components/ErrorMessage.jsx'
import Loader from '@/components/Loader.jsx'
import {
  selectArticle,
  selectOffers,
  selectOffersError,
  selectOffersStatus,
  selectSelectedManufacturer,
} from '@/features/parts/partsSelectors.js'
import { fetchOffers } from '@/features/parts/partsSlice.js'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
})

const stockFormatter = new Intl.NumberFormat('ru-RU')

function OffersTable() {
  const tableContainerRef = useRef(null)
  const dispatch = useDispatch()
  const article = useSelector(selectArticle)
  const offers = useSelector(selectOffers)
  const offersStatus = useSelector(selectOffersStatus)
  const offersError = useSelector(selectOffersError)
  const selectedManufacturer = useSelector(selectSelectedManufacturer)
  const requestRef = useRef(null)
  const rowVirtualizer = useVirtualizer({
    count: offers.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 53,
    overscan: 10,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const paddingTop = virtualRows[0]?.start ?? 0
  const paddingBottom =
    rowVirtualizer.getTotalSize() -
    (virtualRows[virtualRows.length - 1]?.end ?? 0)

  useEffect(() => {
    requestRef.current?.abort()
    requestRef.current = null

    return () => {
      requestRef.current?.abort()
    }
  }, [article, selectedManufacturer])

  const handleRetry = () => {
    requestRef.current?.abort()
    requestRef.current = dispatch(
      fetchOffers({ article, manufacturer: selectedManufacturer }),
    )
  }

  if (offersStatus === 'idle') {
    return null
  }

  return (
    <section aria-labelledby="offers-title">
      <h2 className="h4 mb-3" id="offers-title">
        Предложения и аналоги
      </h2>
      {offersStatus === 'loading' && <Loader message="Ищем предложения…" />}
      {offersStatus === 'failed' && (
        <ErrorMessage message={offersError} onRetry={handleRetry} />
      )}
      {offersStatus === 'succeeded' && offers.length === 0 && (
        <EmptyState message="Предложения для выбранного производителя не найдены." />
      )}
      {offersStatus === 'succeeded' && offers.length > 0 && (
        <div
          ref={tableContainerRef}
          className="table-responsive"
          style={{ maxHeight: '70vh', overflow: 'auto' }}
        >
          <table className="table table-striped table-hover align-middle">
            <thead className="sticky-top">
              <tr>
                <th scope="col">Название</th>
                <th scope="col">Производитель</th>
                <th scope="col">Артикул</th>
                <th scope="col">Склад</th>
                <th className="text-nowrap text-end" scope="col">
                  Цена
                </th>
                <th className="text-nowrap text-end" scope="col">
                  Остаток
                </th>
              </tr>
            </thead>
            <tbody>
              {paddingTop > 0 && (
                <tr aria-hidden="true">
                  <td
                    colSpan={6}
                    style={{ height: paddingTop, padding: 0, border: 0 }}
                  />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const offer = offers[virtualRow.index]

                return (
                  <tr
                    key={offer.id}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                  >
                    <th scope="row">{offer.name}</th>
                    <td>{offer.manufacturer}</td>
                    <td className="text-nowrap">{offer.number}</td>
                    <td>{offer.warehouseCode || offer.warehouseId}</td>
                    <td className="text-nowrap text-end">
                      {priceFormatter.format(offer.price)}
                    </td>
                    <td className="text-nowrap text-end">
                      {stockFormatter.format(offer.stock)}
                    </td>
                  </tr>
                )
              })}
              {paddingBottom > 0 && (
                <tr aria-hidden="true">
                  <td
                    colSpan={6}
                    style={{ height: paddingBottom, padding: 0, border: 0 }}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default OffersTable
