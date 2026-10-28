import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyState from '@/components/EmptyState.jsx'
import ErrorMessage from '@/components/ErrorMessage.jsx'
import Loader from '@/components/Loader.jsx'
import {
  selectManufacturers,
  selectManufacturersError,
  selectManufacturersStatus,
} from '@/features/parts/partsSelectors.js'
import { useDebounce } from '@/hooks/useDebounce.js'
import {
  fetchManufacturers,
  searchInvalidated,
} from '@/features/parts/partsSlice.js'

const SEARCH_DELAY = 400

function PartSearch() {
  const dispatch = useDispatch()
  const manufacturers = useSelector(selectManufacturers)
  const manufacturersStatus = useSelector(selectManufacturersStatus)
  const manufacturersError = useSelector(selectManufacturersError)
  const [article, setArticle] = useState('')
  const debouncedArticle = useDebounce(article, SEARCH_DELAY)
  const requestRef = useRef(null)
  const hasSearchResultsRef = useRef(false)

  const requestManufacturers = useCallback(
    (normalizedArticle) => {
      requestRef.current?.abort()
      requestRef.current = dispatch(fetchManufacturers(normalizedArticle))
      hasSearchResultsRef.current = true
    },
    [dispatch],
  )

  useEffect(() => {
    const normalizedArticle = debouncedArticle.trim()

    if (!normalizedArticle) {
      return undefined
    }

    requestManufacturers(normalizedArticle)

    return () => {
      requestRef.current?.abort()
      requestRef.current = null
    }
  }, [debouncedArticle, requestManufacturers])

  const handleChange = (event) => {
    const nextArticle = event.target.value

    setArticle(nextArticle)

    if (hasSearchResultsRef.current) {
      requestRef.current?.abort()
      requestRef.current = null
      hasSearchResultsRef.current = false
      dispatch(searchInvalidated())
    }
  }

  const handleRetry = () => {
    const normalizedArticle = article.trim()

    if (normalizedArticle) {
      requestManufacturers(normalizedArticle)
    }
  }

  return (
    <div className="mb-4">
      <label className="form-label" htmlFor="part-article">
        Артикул детали
      </label>
      <input
        id="part-article"
        className="form-control"
        type="search"
        value={article}
        onChange={handleChange}
        placeholder="Введите артикул"
        autoComplete="off"
      />
      <div className="mt-3">
        {manufacturersStatus === 'loading' && (
          <Loader message="Ищем производителей…" />
        )}
        {manufacturersStatus === 'failed' && (
          <ErrorMessage
            message={manufacturersError}
            onRetry={handleRetry}
          />
        )}
        {manufacturersStatus === 'succeeded' &&
          manufacturers.length === 0 && (
            <EmptyState message="Производители по этому артикулу не найдены." />
          )}
      </div>
    </div>
  )
}

export default PartSearch
