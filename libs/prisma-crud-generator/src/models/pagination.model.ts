export interface PaginationModel<T> {
  items: T[];
  meta: {
    totalItems: number;
    items: number;
    totalPages: number;
    page: number;
  };
}
