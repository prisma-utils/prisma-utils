import { BadRequestException } from '@nestjs/common';

import {
  ParsedQueryModel,
  ParsedQuerySortModel,
} from '../models/parsed-query.model';
import { RequestQueryOptions } from '../models/request-query.options';

const defaultRequestQueryOptions: RequestQueryOptions = {
  limitParamName: 'limit',
  limitDefaultValue: 20,
  maxLimit: 100,

  filterParamName: 'filter',
  filterDefaultValue: {},

  pageParamName: 'page',
  pageDefaultValue: 1,

  orderParamName: 'sort',
  orderDefaultValue: 'id',
};

export class RequestParserService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private query: any;
  private options: RequestQueryOptions = defaultRequestQueryOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    options: Partial<RequestQueryOptions> = {},
  ): ParsedQueryModel {
    if (typeof query !== 'object') {
      throw new BadRequestException('Malformed QueryString');
    }

    this.options = { ...defaultRequestQueryOptions, ...options };

    this.query = query;

    const page = this.parsePage();
    const limit = this.parseLimit();
    const sort = this.parseSort();
    const filter = this.parseFilter();

    return {
      page: page,
      skip: this.calculateSkip(page, limit),
      take: limit,
      sort: sort,
      filter: filter,
    };
  }

  private parsePage(): number {
    const pageRequestData = this.query[this.options.pageParamName];

    const page = parseInt(pageRequestData) || this.options.pageDefaultValue;

    if (page < 1) {
      return this.options.pageDefaultValue;
    }

    return page;
  }

  private parseLimit(): number {
    const limitRequestData = this.query[this.options.limitParamName];

    let limit = parseInt(limitRequestData) || this.options.limitDefaultValue;

    if (limit < 1) {
      limit = this.options.limitDefaultValue;
    }

    if (limit > this.options.maxLimit) {
      limit = this.options.maxLimit;
    }

    return limit;
  }

  private calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  private parseFilter(): object {
    let filter: object = {};

    const filterRequestData =
      this.query[this.options.filterParamName] ||
      this.options.filterDefaultValue;

    try {
      filter = JSON.parse(filterRequestData);
    } catch (e) {
      return filter;
    }
    return filter;
  }

  private parseSort(): ParsedQuerySortModel[] {
    const sort: ParsedQuerySortModel[] = [];

    const sortRequestData =
      this.query[this.options.orderParamName] || this.options.orderDefaultValue;

    const sortQuery = (sortRequestData as string).trim();

    if (sortQuery !== undefined) {
      if (sortQuery.length > 0) {
        const sortParams = sortQuery.split(',');

        for (let sortParam of sortParams) {
          sortParam = sortParam.trim();
          let sortDirection = 'asc' as 'asc' | 'desc' as 'desc';

          if (sortParam.startsWith('-')) {
            sortParam = sortParam.substring(1);
            sortDirection = 'desc';
          }

          sort.push({ [sortParam]: sortDirection });
        }
      }
    }

    return sort;
  }
}
