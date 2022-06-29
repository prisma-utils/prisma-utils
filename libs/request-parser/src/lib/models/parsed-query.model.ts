export interface ParsedQueryModel {
  page: number;
  skip: number;
  take: number;
  sort: ParsedQuerySortModel[];
  select: ParsedQuerySelectModel | undefined;
}

export interface ParsedQuerySortModel {
  [k: string]: 'asc' | 'desc';
}

export interface ParsedQuerySelectModel {
  [k: string]: boolean;
}
