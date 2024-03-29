export interface RequestQueryOptions {
  limitParamName: string;
  limitDefaultValue: number;
  maxLimit: number;

  pageParamName: string;
  pageDefaultValue: number;

  orderParamName: string;
  orderDefaultValue: string;

  filterParamName: string;
  filterDefaultValue: object;
}
