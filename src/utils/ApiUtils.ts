export interface FilterItem {
  key: string;
  values: any[];
  type: string;
  options: string;
}

export interface Pager {
  current: number;
  limit?: number;
  total?: number;
  sortBy?: string;
}

const filterToString = (filters: FilterItem[]): string => {
  const _filters: string[] = [];

  for (const filter of filters) {
    const { key, values, type, options } = filter;

    if (key && values[0] !== undefined && type && options) {
      _filters.push(`${key}:${type};${values[0]};${options}`);
    }
    if (key && values[0] !== undefined && type && !options) {
      _filters.push(`${key}:${type};${values[0]}`);
    }
    if (key && values[0] !== undefined && !type && !options) {
      _filters.push(`${key}:${values[0]}`);
    }
  }

  return _filters.join('|');
};

const queryBuilder = (pager: Pager, filter: FilterItem[]): string => {
  const pagerInfo = [`current=${pager.current}`, `limit=${pager.limit || pager.limit}`];
  if (pager.sortBy) pagerInfo.push(`sortBy=${pager.sortBy}`);
  if (filter && filter.length) pagerInfo.push(`filter=${filterToString(filter)}`);

  return pagerInfo.join('&');
};

export { filterToString, queryBuilder };
