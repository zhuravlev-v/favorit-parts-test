import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getManufacturers, getOffers } from '@/api/partsApi.js'

const initialState = {
  article: '',
  manufacturers: [],
  selectedManufacturer: null,
  offers: [],
  manufacturersStatus: 'idle',
  offersStatus: 'idle',
  manufacturersError: null,
  offersError: null,
  manufacturersRequestId: null,
  offersRequestId: null,
}

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'Произошла неизвестная ошибка.'

export const fetchManufacturers = createAsyncThunk(
  'parts/fetchManufacturers',
  async (article, { rejectWithValue, signal }) => {
    try {
      const normalizedArticle = article.trim()
      const manufacturers = await getManufacturers(normalizedArticle, { signal })

      return { article: normalizedArticle, manufacturers }
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw error
      }

      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ article, manufacturer }, { rejectWithValue, signal }) => {
    try {
      const offers = await getOffers(article, manufacturer, { signal })

      return { article, manufacturer, offers }
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw error
      }

      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    searchInvalidated: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManufacturers.pending, (state, action) => {
        state.article = action.meta.arg.trim()
        state.manufacturers = []
        state.selectedManufacturer = null
        state.offers = []
        state.manufacturersStatus = 'loading'
        state.offersStatus = 'idle'
        state.manufacturersError = null
        state.offersError = null
        state.manufacturersRequestId = action.meta.requestId
        state.offersRequestId = null
      })
      .addCase(fetchManufacturers.fulfilled, (state, action) => {
        if (state.manufacturersRequestId !== action.meta.requestId) {
          return
        }

        state.manufacturers = action.payload.manufacturers
        state.manufacturersStatus = 'succeeded'
        state.manufacturersRequestId = null
      })
      .addCase(fetchManufacturers.rejected, (state, action) => {
        if (state.manufacturersRequestId !== action.meta.requestId) {
          return
        }

        state.manufacturersStatus = action.meta.aborted ? 'idle' : 'failed'
        state.manufacturersError = action.meta.aborted
          ? null
          : action.payload || action.error.message
        state.manufacturersRequestId = null
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.selectedManufacturer = action.meta.arg.manufacturer
        state.offers = []
        state.offersStatus = 'loading'
        state.offersError = null
        state.offersRequestId = action.meta.requestId
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (state.offersRequestId !== action.meta.requestId) {
          return
        }

        state.offers = action.payload.offers
        state.offersStatus = 'succeeded'
        state.offersRequestId = null
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (state.offersRequestId !== action.meta.requestId) {
          return
        }

        state.offersStatus = action.meta.aborted ? 'idle' : 'failed'
        state.offersError = action.meta.aborted
          ? null
          : action.payload || action.error.message
        state.offersRequestId = null
      })
  },
})

export const { searchInvalidated } = partsSlice.actions
export default partsSlice.reducer
