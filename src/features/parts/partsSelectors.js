const selectParts = (state) => state.parts

export const selectArticle = (state) => selectParts(state).article
export const selectManufacturers = (state) => selectParts(state).manufacturers
export const selectSelectedManufacturer = (state) =>
  selectParts(state).selectedManufacturer
export const selectOffers = (state) => selectParts(state).offers
export const selectManufacturersStatus = (state) =>
  selectParts(state).manufacturersStatus
export const selectOffersStatus = (state) => selectParts(state).offersStatus
export const selectManufacturersError = (state) =>
  selectParts(state).manufacturersError
export const selectOffersError = (state) => selectParts(state).offersError
