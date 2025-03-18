export interface IPagePayload {
  sort: {
    property: string,
    direction: 'asc' | 'desc',
  },
  page: {
    index: number,
    indexPrevious: number,
    pageIndexes: number[], // example: [1, 2, 3], so can iterate and show it in UI
    itemsPerPage: number,
    totalElements: number,

  }
}
