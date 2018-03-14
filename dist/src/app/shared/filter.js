var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FilterFactory = (function () {
    function FilterFactory(url) {
        this.url = url;
    }
    FilterFactory.getFiltersByUrl = function (url) {
        var regex = /\?(.*)/g;
        var regexQueryParams = regex.exec(url);
        if (!regexQueryParams || (regexQueryParams && regexQueryParams.length === 0)) {
            return [];
        }
        var strQueryParams = regexQueryParams[1];
        if (!strQueryParams) {
            return [];
        }
        var splitQueryParams = strQueryParams.split('&');
        var extraFilters = [];
        var filters = [];
        for (var _i = 0, splitQueryParams_1 = splitQueryParams; _i < splitQueryParams_1.length; _i++) {
            var queryParam = splitQueryParams_1[_i];
            var splitQueryParam = queryParam.split('=');
            var key = splitQueryParam[0];
            var value = splitQueryParam[1];
            var splitValue = value.split(':');
            var filter = void 0;
            switch (key) {
                case 'filterBy':
                    var strOperator = splitValue[2];
                    var operatorOptions = strOperator && strOperator === 'like' ? OperatorOptions.Like : OperatorOptions.Equals;
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
                    var strOrderOption = splitValue[1];
                    var orderByOption = strOrderOption && strOrderOption === 'desc' ? OrderByOptions.Desc : OrderByOptions.Asc;
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
    };
    FilterFactory.prototype.addFilter = function (filter) {
        if (!this.url) {
            this.url = '';
        }
        if (this.url.length > 0) {
            this.url += '&' + filter.toString();
        }
        else {
            this.url += filter.toString();
        }
    };
    FilterFactory.prototype.generateUrl = function (filtersOptions) {
        var strFilters = '';
        for (var key in filtersOptions) {
            if (!filtersOptions.hasOwnProperty(key)) {
                continue;
            }
            var filterOption = filtersOptions[key];
            var strFilterOption = filterOption.toString();
            if (!strFilterOption) {
                continue;
            }
            strFilters += strFilters.length > 0 ? '&' : '?';
            strFilters += strFilterOption;
        }
        return this.url + strFilters;
    };
    return FilterFactory;
}());
export { FilterFactory };
var Filter = (function () {
    function Filter(name, value) {
        this._name = name;
        this._value = value;
    }
    Object.defineProperty(Filter.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Filter.prototype.toString = function () {
        if (this._name && this._value) {
            return this._name + '=' + this._value;
        }
        return '';
    };
    return Filter;
}());
export { Filter };
export var OperatorOptions;
(function (OperatorOptions) {
    OperatorOptions[OperatorOptions["Equals"] = 0] = "Equals";
    OperatorOptions[OperatorOptions["Like"] = 1] = "Like";
})(OperatorOptions || (OperatorOptions = {}));
var FilterBy = (function (_super) {
    __extends(FilterBy, _super);
    function FilterBy(attribute, value, operatorOption) {
        var _this = _super.call(this, 'filterBy', value) || this;
        _this.attribute = attribute;
        _this.operatorOption = operatorOption !== undefined ? operatorOption : OperatorOptions.Equals;
        return _this;
    }
    FilterBy.prototype.toString = function () {
        if (this.name && this.value && this.attribute) {
            var str = this.name + '=' + this.attribute + ':' + this.value;
            if (this.operatorOption === OperatorOptions.Like) {
                str += ':like';
            }
            return str;
        }
        return '';
    };
    return FilterBy;
}(Filter));
export { FilterBy };
export var OrderByOptions;
(function (OrderByOptions) {
    OrderByOptions[OrderByOptions["Desc"] = 0] = "Desc";
    OrderByOptions[OrderByOptions["Asc"] = 1] = "Asc";
})(OrderByOptions || (OrderByOptions = {}));
var OrderBy = (function (_super) {
    __extends(OrderBy, _super);
    function OrderBy(attribute, orderByOption) {
        var _this = _super.call(this, 'orderBy', attribute) || this;
        _this.orderByOption = orderByOption !== undefined ? orderByOption : OrderByOptions.Desc;
        return _this;
    }
    OrderBy.prototype.toString = function () {
        if (this.name && this.value) {
            var strOrderByOption = 'desc';
            if (this.orderByOption === OrderByOptions.Asc) {
                strOrderByOption = 'asc';
            }
            return this.name + '=' + this.value + ':' + strOrderByOption;
        }
        return '';
    };
    return OrderBy;
}(Filter));
export { OrderBy };
var Select = (function (_super) {
    __extends(Select, _super);
    function Select(value) {
        return _super.call(this, 'select', value) || this;
    }
    return Select;
}(Filter));
export { Select };
var Search = (function (_super) {
    __extends(Search, _super);
    function Search(value) {
        return _super.call(this, 'search', value) || this;
    }
    return Search;
}(Filter));
export { Search };
var Limit = (function (_super) {
    __extends(Limit, _super);
    function Limit(value) {
        return _super.call(this, 'limit', value + '') || this;
    }
    return Limit;
}(Filter));
export { Limit };
var Offset = (function (_super) {
    __extends(Offset, _super);
    function Offset(value) {
        return _super.call(this, 'offset', value + '') || this;
    }
    return Offset;
}(Filter));
export { Offset };
var Extra = (function (_super) {
    __extends(Extra, _super);
    function Extra(filters) {
        var _this = _super.call(this, 'extra', filters.toString()) || this;
        _this.filters = filters;
        return _this;
    }
    Extra.prototype.toString = function () {
        var str = '';
        for (var _i = 0, _a = this.filters; _i < _a.length; _i++) {
            var filter = _a[_i];
            var strFilter = filter.toString();
            if (strFilter) {
                str += str.length > 0 ? '&' : '';
                str += strFilter;
            }
        }
        return str;
    };
    return Extra;
}(Filter));
export { Extra };
var Total = (function (_super) {
    __extends(Total, _super);
    function Total(value) {
        return _super.call(this, 'total', value + '') || this;
    }
    return Total;
}(Filter));
export { Total };
//# sourceMappingURL=filter.js.map