export interface FiltersOptions {
  filterBy?: FilterBy;
  select?: Select;
  offset?: Offset;
  limit?: Limit;
  orderBy?: OrderBy;
  search?: Filter;
  extra?: Extra;
  total?: Total;
}

export class FilterFactory {
  url: string;

  static getFiltersByUrl(url: string): Filter[] {
    const regex = /\?(.*)/g;
    const regexQueryParams = regex.exec(url);

    if (!regexQueryParams || (regexQueryParams && regexQueryParams.length === 0)) {
      return [];
    }
    const strQueryParams = regexQueryParams[1];
    if (!strQueryParams) {
      return [];
    }
    const splitQueryParams = strQueryParams.split('&');
    const extraFilters = [];
    const filters: Filter[] = [];
    for (const queryParam of splitQueryParams) {
      const splitQueryParam = queryParam.split('=');
      const key = splitQueryParam[0];
      const value = splitQueryParam[1];
      const splitValue = value.split(':');

      let filter;
      switch (key) {
        case 'filterBy':
          const strOperator = splitValue[2];
          const operatorOptions = strOperator && strOperator === 'like' ? OperatorOptions.Like : OperatorOptions.Equals;
          filter = new FilterBy(splitValue[0], splitValue[1], operatorOptions);
          break;
        case 'select':
          filter = new Select(value);
          break;
        case 'offset':
          filter = new Offset(Number.parseInt(value));
          break;
        case 'limit':
          filter = new Limit(Number.parseInt(value));
          break;
        case 'orderBy':
          const strOrderOption = splitValue[1];
          const orderByOption = strOrderOption && strOrderOption === 'desc' ? OrderByOptions.Desc : OrderByOptions.Asc;
          filter = new OrderBy(value, orderByOption);
          break;
        case 'search':
          filter = new Search(value);
          break;
        case 'total':
          filter = new Total(Number.parseInt(value));
          break;
        default:
          extraFilters.push(new Filter(key, value));
          break;
      }
      if (filter) {
        filters.push(filter);
      }
    }
    if (extraFilters.length > 0) {
      filters.push(new Extra(extraFilters));
    }
    return filters;
  }

  constructor(url: string) {
    this.url = url;
  }

  addFilter(filter: Filter) {
    if (!this.url) {
      this.url = '';
    }

    if (this.url.length > 0) {
      this.url += '&' + filter.toString();
    } else {
      this.url += filter.toString();
    }
  }

  generateUrl(filtersOptions: FiltersOptions): string {
    let strFilters = '';

    for (const key in filtersOptions) {
      if (!filtersOptions.hasOwnProperty(key)) {
        continue;
      }

      const filterOption = (<any>filtersOptions)[key];
      const strFilterOption = filterOption.toString();
      if (!strFilterOption) {
        continue;
      }

      strFilters += strFilters.length > 0 ? '&' : '?';
      strFilters += strFilterOption;
    }

    return this.url + strFilters;
  }
}

export class Filter {
  private _name: string;
  private _value: any;

  constructor(name: string, value: string) {
    this._name = name;
    this._value = value;
  }

  get name(): string {
    return this._name;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }

  toString(): string {
    if (this._name && this._value) {
      return this._name + '=' + this._value;
    }
    return '';
  }
}

export enum OperatorOptions {
  Equals,
  Like
}

export class FilterBy extends Filter {
  attribute: string;
  operatorOption: OperatorOptions;

  constructor(attribute: string, value: string, operatorOption?: OperatorOptions) {
    super('filterBy', value);
    this.attribute = attribute;
    this.operatorOption = operatorOption !== undefined ? operatorOption : OperatorOptions.Equals;
  }

  toString(): string {
    if (this.name && this.value && this.attribute) {
      let str = this.name + '=' + this.attribute + ':' + this.value;
      if (this.operatorOption === OperatorOptions.Like) {
        str += ':like';
      }
      return str;
    }
    return '';
  }
}

export enum OrderByOptions {
  Desc,
  Asc
}

export class OrderBy extends Filter {
  orderByOption: OrderByOptions;

  constructor(attribute: string, orderByOption?: OrderByOptions) {
    super('orderBy', attribute);
    this.orderByOption = orderByOption !== undefined ? orderByOption : OrderByOptions.Desc;
  }

  toString(): string {
    if (this.name && this.value) {
      let strOrderByOption = 'desc';
      if (this.orderByOption === OrderByOptions.Asc) {
        strOrderByOption = 'asc';
      }
      return this.name + '=' + this.value + ':' + strOrderByOption;
    }
    return '';
  }
}

export class Select extends Filter {

  constructor(value: string) {
    super('select', value);
  }
}

export class Search extends Filter {

  constructor(value: string) {
    super('search', value);
  }
}

export class Limit extends Filter {

  constructor(value: number) {
    super('limit', value + '');
  }
}

export class Offset extends Filter {

  constructor(value: number) {
    super('offset', value + '');
  }
}

export class Extra extends Filter {

  filters: Filter[];

  constructor(filters: Filter[]) {
    super('extra', filters.toString());
    this.filters = filters;
  }

  toString() {
    let str = '';
    for (const filter of this.filters) {
      const strFilter = filter.toString();
      if (strFilter) {
        str += str.length > 0 ? '&' : '';
        str += strFilter;
      }
    }
    return str;
  }
}

export class Total extends Filter {

  constructor(value: number) {
    super('total', value + '');
  }
}
