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
export declare class FilterFactory {
    url: string;
    static getFiltersByUrl(url: string): Filter[];
    constructor(url: string);
    addFilter(filter: Filter): void;
    generateUrl(filtersOptions: FiltersOptions): string;
}
export declare class Filter {
    private _name;
    private _value;
    constructor(name: string, value: string);
    readonly name: string;
    value: any;
    toString(): string;
}
export declare enum OperatorOptions {
    Equals = 0,
    Like = 1,
}
export declare class FilterBy extends Filter {
    attribute: string;
    operatorOption: OperatorOptions;
    constructor(attribute: string, value: string, operatorOption?: OperatorOptions);
    toString(): string;
}
export declare enum OrderByOptions {
    Desc = 0,
    Asc = 1,
}
export declare class OrderBy extends Filter {
    orderByOption: OrderByOptions;
    constructor(attribute: string, orderByOption?: OrderByOptions);
    toString(): string;
}
export declare class Select extends Filter {
    constructor(value: string);
}
export declare class Search extends Filter {
    constructor(value: string);
}
export declare class Limit extends Filter {
    constructor(value: number);
}
export declare class Offset extends Filter {
    constructor(value: number);
}
export declare class Extra extends Filter {
    filters: Filter[];
    constructor(filters: Filter[]);
    toString(): string;
}
export declare class Total extends Filter {
    constructor(value: number);
}
