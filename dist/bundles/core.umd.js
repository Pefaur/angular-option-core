(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/http'), require('rxjs/add/observable/of'), require('rxjs/Observable'), require('util'), require('moment'), require('rxjs/add/operator/map'), require('rxjs/add/operator/catch'), require('rxjs/add/observable/throw'), require('@angular/router'), require('@angular/http/testing'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/http', 'rxjs/add/observable/of', 'rxjs/Observable', 'util', 'moment', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'rxjs/add/observable/throw', '@angular/router', '@angular/http/testing', '@angular/forms'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}),global.ng.core,global.ng.common,global.ng.http,global.Rx,global.Rx,global.util,global.moment,global.Rx,global.Rx,global.Rx,global.ng.router,global._angular_http_testing,global.ng.forms));
}(this, (function (exports,_angular_core,_angular_common,_angular_http,rxjs_add_observable_of,rxjs_Observable,util,moment,rxjs_add_operator_map,rxjs_add_operator_catch,rxjs_add_observable_throw,_angular_router,_angular_http_testing,_angular_forms) { 'use strict';

var MODULE_CONFIG = new _angular_core.InjectionToken('module.config');
// Example
// export const API_URL: string = 'http://api.backend.com';
// export const LAZY_SCRIPT_STORE: OptScript[] = [
//   {
//     name: 'slimscroll',
//     src: '../../../assets/plugins/slimscroll/jquery.slimscroll.js'
//   },
//   {
//     name: 'colorpicker',
//     src: '../../../assets/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js'
//   }
// ];
//  export const MODULE_CONFIG = {
//    apiUrl: API_URL,
//    lazyScriptsStore: LAZY_SCRIPT_STORE
//  };

/**
 * @author Carolina Pinzon <cpinzon@option.cl>
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
var OptResponse = (function () {
    function OptResponse() {
    }
    OptResponse.fromJSON = function (response) {
        var instance = new OptResponse();
        instance.isStatusOk = response.ok;
        instance.statusCode = response.status;
        instance.headers = response.headers;
        if (response._body !== '') {
            instance.object = response.json();
        }
        else {
            instance.object = {};
        }
        return instance;
    };
    return OptResponse;
}());

var OptAuthService = (function () {
    function OptAuthService(config, http) {
        this.config = config;
        this.http = http;
        this.headers = new _angular_http.Headers({ 'Content-Type': 'application/json' });
        this.baseUrl = config.apiUrl;
    }
    OptAuthService.prototype.register = function (user) {
        return this.http
            .post(this.baseUrl + '/register', JSON.stringify(user.toRegisterForm()), { headers: this.headers })
            .map(function (response) {
            return OptResponse.fromJSON(response);
        })
            .catch(this.handleError);
    };
    OptAuthService.prototype.login = function (email, password) {
        var _this = this;
        var credentials = {
            'credentials': {
                'username': email,
                'password': password
            }
        };
        return this.http
            .post(this.baseUrl + '/login', JSON.stringify(credentials), { headers: this.headers })
            .map(function (response) {
            _this.setToken(response.json().authorization.simpleToken);
            return OptResponse.fromJSON(response);
        })
            .catch(this.handleError);
    };
    OptAuthService.prototype.logout = function () {
        this.clearSession();
        var response = new OptResponse();
        response.isStatusOk = true;
        response.statusCode = 200;
        return rxjs_Observable.Observable.of(response);
    };
    OptAuthService.prototype.recoverPassword = function (email) {
        // reset/send-email
        // {username: dcaris@optionti.com}
        var body = { username: email };
        return this.http
            .post(this.baseUrl + '/reset/send-email', JSON.stringify(body), { headers: this.headers })
            .map(function (response) {
            return OptResponse.fromJSON(response);
        })
            .catch(this.handleError);
    };
    OptAuthService.prototype.resetPassword = function (token, password, passwordConfirmation) {
        var body = {
            password: password,
            passwordConfirmation: passwordConfirmation
        };
        return this.http
            .post(this.baseUrl + '/reset-password/' + token, JSON.stringify(body), { headers: this.headers })
            .map(function (response) {
            return OptResponse.fromJSON(response);
        })
            .catch(this.handleError);
    };
    OptAuthService.prototype.isLoggedIn = function () {
        return !!this.getToken();
    };
    OptAuthService.prototype.clearSession = function () {
        this.removeToken();
    };
    OptAuthService.prototype.removeToken = function () {
        localStorage.removeItem('authorization_token');
    };
    OptAuthService.prototype.setToken = function (token) {
        localStorage.setItem('authorization_token', token);
    };
    OptAuthService.prototype.getToken = function () {
        return localStorage.getItem('authorization_token');
    };
    
    OptAuthService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return rxjs_Observable.Observable.throw(OptResponse.fromJSON(error));
    };
    return OptAuthService;
}());
OptAuthService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptAuthService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [MODULE_CONFIG,] },] },
    { type: _angular_http.Http, },
]; };

var OptLazyScriptService = (function () {
    function OptLazyScriptService(config) {
        var _this = this;
        this.config = config;
        this.scripts = {};
        config.lazyScriptsStore.forEach(function (script) {
            _this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }
    OptLazyScriptService.prototype.load = function () {
        var _this = this;
        var scripts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scripts[_i] = arguments[_i];
        }
        var promises = [];
        scripts.forEach(function (script) { return promises.push(_this.loadScript(script)); });
        return Promise.all(promises);
    };
    OptLazyScriptService.prototype.loadScript = function (name) {
        var _this = this;
        if (this.scripts[name].promise) {
            return this.scripts[name].promise;
        }
        return this.scripts[name].promise = new Promise(function (resolve, reject) {
            // resolve if already loaded
            if (_this.scripts[name].loaded) {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            }
            else {
                // load script
                var script_1 = document.createElement('script');
                script_1.type = 'text/javascript';
                script_1.src = _this.scripts[name].src;
                if (script_1.readyState) {
                    script_1.onreadystatechange = function () {
                        if (script_1.readyState === 'loaded' || script_1.readyState === 'complete') {
                            script_1.onreadystatechange = null;
                            _this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        }
                    };
                }
                else {
                    script_1.onload = function () {
                        _this.scripts[name].loaded = true;
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    };
                }
                script_1.onerror = function (error) { return resolve({ script: name, loaded: false, status: 'Loaded' }); };
                document.getElementsByTagName('head')[0].appendChild(script_1);
            }
        });
    };
    OptLazyScriptService.prototype.isLoadedScript = function (name) {
        return !!this.scripts[name].loaded;
    };
    return OptLazyScriptService;
}());
OptLazyScriptService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptLazyScriptService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [MODULE_CONFIG,] },] },
]; };

var OptionCoreModule = (function () {
    function OptionCoreModule() {
    }
    OptionCoreModule.forRoot = function (config) {
        return {
            ngModule: OptionCoreModule,
            providers: [OptAuthService, OptLazyScriptService, { provide: MODULE_CONFIG, useValue: config }]
        };
    };
    return OptionCoreModule;
}());
OptionCoreModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule
                ],
                declarations: []
            },] },
];
/** @nocollapse */
OptionCoreModule.ctorParameters = function () { return []; };

/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 * Parent abstract class for models
 */
var OptEntity = (function () {
    function OptEntity(jsonObject) {
        if (!jsonObject) {
            return;
        }
        this.decode(jsonObject);
    }
    /**
     * Use for generate form attribute from key instance attribute
     */
    OptEntity.prototype.getFormContentAttribute = function (key, attribute) {
        var _this = this;
        var formAttribute;
        if (key !== 'id' && !util.isUndefined(attribute)) {
            var attributeId = attribute && attribute.id ? attribute.id : null;
            attributeId = !attributeId && (attribute && attribute._id) ? attribute._id : attributeId;
            if (attribute instanceof OptEntity && attributeId) {
                formAttribute = attributeId;
            }
            else if (moment.isMoment(attribute)) {
                formAttribute = attribute.format();
            }
            else if (Array.isArray(attribute)) {
                if (attribute.length > 0) {
                    formAttribute = [];
                    Object.keys(attribute).map(function (subAttributeKey) {
                        var formContentAttribute = _this.getFormContentAttribute(subAttributeKey, attribute[subAttributeKey]);
                        if (!util.isUndefined(formContentAttribute)) {
                            formAttribute.push(formContentAttribute);
                        }
                    });
                }
            }
            else {
                formAttribute = attribute;
            }
        }
        return formAttribute;
    };
    /**
     * Get form object of the entity
     */
    OptEntity.prototype.getFormContent = function () {
        var formContent = {};
        var self = this;
        Object.keys(this).map(function (key) {
            var attribute = self[key];
            // remove underscore on private attributes
            key = key.replace(/^[_]/g, '');
            var formContentAttribute = self.getFormContentAttribute(key, attribute);
            if (!util.isUndefined(formContentAttribute)) {
                formContent[key] = formContentAttribute;
            }
        });
        return formContent;
    };
    /**
     * Parse instance object data to json object for api rest
     */
    OptEntity.prototype.toForm = function () {
        var form = {};
        form[this.getFormEntityName()] = this.getFormContent();
        return form;
    };
    return OptEntity;
}());

var __extends = (undefined && undefined.__extends) || (function () {
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
                    var operatorOptions = strOperator && strOperator === 'like' ? exports.OperatorOptions.Like : exports.OperatorOptions.Equals;
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
                    var orderByOption = strOrderOption && strOrderOption === 'desc' ? exports.OrderByOptions.Desc : exports.OrderByOptions.Asc;
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

(function (OperatorOptions) {
    OperatorOptions[OperatorOptions["Equals"] = 0] = "Equals";
    OperatorOptions[OperatorOptions["Like"] = 1] = "Like";
})(exports.OperatorOptions || (exports.OperatorOptions = {}));
var FilterBy = (function (_super) {
    __extends(FilterBy, _super);
    function FilterBy(attribute, value, operatorOption) {
        var _this = _super.call(this, 'filterBy', value) || this;
        _this.attribute = attribute;
        _this.operatorOption = operatorOption !== undefined ? operatorOption : exports.OperatorOptions.Equals;
        return _this;
    }
    FilterBy.prototype.toString = function () {
        if (this.name && this.value && this.attribute) {
            var str = this.name + '=' + this.attribute + ':' + this.value;
            if (this.operatorOption === exports.OperatorOptions.Like) {
                str += ':like';
            }
            return str;
        }
        return '';
    };
    return FilterBy;
}(Filter));

(function (OrderByOptions) {
    OrderByOptions[OrderByOptions["Desc"] = 0] = "Desc";
    OrderByOptions[OrderByOptions["Asc"] = 1] = "Asc";
})(exports.OrderByOptions || (exports.OrderByOptions = {}));
var OrderBy = (function (_super) {
    __extends(OrderBy, _super);
    function OrderBy(attribute, orderByOption) {
        var _this = _super.call(this, 'orderBy', attribute) || this;
        _this.orderByOption = orderByOption !== undefined ? orderByOption : exports.OrderByOptions.Desc;
        return _this;
    }
    OrderBy.prototype.toString = function () {
        if (this.name && this.value) {
            var strOrderByOption = 'desc';
            if (this.orderByOption === exports.OrderByOptions.Asc) {
                strOrderByOption = 'asc';
            }
            return this.name + '=' + this.value + ':' + strOrderByOption;
        }
        return '';
    };
    return OrderBy;
}(Filter));
var Select = (function (_super) {
    __extends(Select, _super);
    function Select(value) {
        return _super.call(this, 'select', value) || this;
    }
    return Select;
}(Filter));
var Search = (function (_super) {
    __extends(Search, _super);
    function Search(value) {
        return _super.call(this, 'search', value) || this;
    }
    return Search;
}(Filter));
var Limit = (function (_super) {
    __extends(Limit, _super);
    function Limit(value) {
        return _super.call(this, 'limit', value + '') || this;
    }
    return Limit;
}(Filter));
var Offset = (function (_super) {
    __extends(Offset, _super);
    function Offset(value) {
        return _super.call(this, 'offset', value + '') || this;
    }
    return Offset;
}(Filter));
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
var Total = (function (_super) {
    __extends(Total, _super);
    function Total(value) {
        return _super.call(this, 'total', value + '') || this;
    }
    return Total;
}(Filter));

/**
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
var OptFilteredResponse = (function () {
    function OptFilteredResponse(response, data) {
        this.data = data;
        this.filtersOptions = FilterFactory.getFiltersByUrl(response.url);
        this.filtersOptions.total = new Total(Number.parseInt(response.json().total));
    }
    return OptFilteredResponse;
}());

var OptPasswordValidation = (function () {
    function OptPasswordValidation() {
    }
    OptPasswordValidation.MatchPassword = function (AC) {
        var password = AC.get('password').value; // to get value in input tag
        var confirmPassword = AC.get('repeatPassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('repeatPassword').setErrors({ MatchPassword: true });
        }
        else {
            return null;
        }
    };
    return OptPasswordValidation;
}());

var OptRestService = (function () {
    function OptRestService(config, auth, http) {
        this.config = config;
        this.auth = auth;
        this.http = http;
        this.apiVersion = 'v1.0';
        this.defaultHeaders = new _angular_http.Headers({
            'Content-Type': 'application/json'
        });
        this.apiUrl = config.apiUrl;
    }
    OptRestService.prototype.createFilteredResponse = function (response) {
        var _this = this;
        var entities = response.json().result.map(function (item) {
            return _this.createEntity(item);
        });
        return new OptFilteredResponse(response, entities);
    };
    OptRestService.prototype.getBaseUrl = function () {
        return this.apiUrl + '/' + this.apiVersion;
    };
    OptRestService.prototype.getHeaders = function () {
        var headers = Object.assign(this.defaultHeaders.toJSON(), {
            'Authorization': this.auth.getToken()
        });
        return new _angular_http.Headers(headers);
    };
    OptRestService.prototype.getList = function () {
        var _this = this;
        return this.http
            .get(this.getEntityBaseUrl() + '?limit=1000', { headers: this.getHeaders() })
            .map(function (response) {
            return response.json().result.map(function (item) {
                return _this.createEntity(item);
            });
        })
            .catch(this.handleError);
    };
    // @example filtersOptions: FiltersOptions = {
    //   filterBy: new FilterBy('name', 'orellana', OperatorOptions.Like),
    //   select: new Select('name'),
    //   offset: new Offset(0),
    //   limit: new Limit(10),
    //   orderBy: new OrderBy('name', OrderByOptions.Desc),
    //   search: new Search('orellana'),
    //   extra: new Extra([
    //     new Filter('practitioner', 'orellana'),
    //     new Filter('from', '2017-09-15'),
    //     new Filter('to', '2017-09-18')
    //   ]),
    // };
    OptRestService.prototype.getFilteredList = function (filtersOptions) {
        var _this = this;
        var filterFactory = new FilterFactory(this.getEntityBaseUrl());
        var url = filterFactory.generateUrl(filtersOptions);
        return this.http.get(url, { headers: this.getHeaders() })
            .map(function (response) { return _this.createFilteredResponse(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.getOne = function (id) {
        var _this = this;
        var url = this.getEntityBaseUrl() + '/' + id;
        return this.http.get(url, { headers: this.getHeaders() })
            .map(function (response) { return _this.createEntity(response.json().result); })
            .catch(this.handleError);
    };
    OptRestService.prototype.remove = function (id) {
        var url = this.getEntityBaseUrl() + '/' + id;
        return this.http.delete(url, { headers: this.getHeaders() })
            .map(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.create = function (entity) {
        return this.http
            .post(this.getEntityBaseUrl(), JSON.stringify(entity.toForm()), { headers: this.getHeaders() })
            .map(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.update = function (entity) {
        var url = this.getEntityBaseUrl() + '/' + entity.id;
        return this.http
            .patch(url, JSON.stringify(entity.toForm()), { headers: this.getHeaders() })
            .map(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.change = function (entity) {
        var url = this.getEntityBaseUrl() + '/' + entity.id;
        return this.http
            .put(url, JSON.stringify(entity.toForm()), { headers: this.getHeaders() })
            .map(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return rxjs_Observable.Observable.throw(OptResponse.fromJSON(error));
    };
    return OptRestService;
}());
OptRestService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptRestService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [MODULE_CONFIG,] },] },
    { type: OptAuthService, },
    { type: _angular_http.Http, },
]; };

var OptAuthGuard = (function () {
    function OptAuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
        this.loginRoute = '/login';
    }
    OptAuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    OptAuthGuard.prototype.canActivateChild = function (route, state) {
        return this.canActivate(route, state);
    };
    OptAuthGuard.prototype.canDeactivate = function (component, currentRoute, currentState) {
        var url = currentState.url;
        return this.checkLogout(url);
    };
    OptAuthGuard.prototype.checkLogin = function (url) {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
        // Navigate to the login page with extras
        this.router.navigate([this.loginRoute]);
        return false;
    };
    OptAuthGuard.prototype.checkLogout = function (url) {
        if (!this.authService.isLoggedIn()) {
            return true;
        }
        // Navigate to the home page
        this.router.navigate(['']);
        return false;
    };
    return OptAuthGuard;
}());
OptAuthGuard.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptAuthGuard.ctorParameters = function () { return [
    { type: OptAuthService, },
    { type: _angular_router.Router, },
]; };

// Models

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MockError = (function (_super) {
    __extends$2(MockError, _super);
    function MockError(responseOptions) {
        return _super.call(this, new _angular_http.ResponseOptions(responseOptions)) || this;
    }
    return MockError;
}(_angular_http.Response));
var Mock = (function () {
    function Mock(connection) {
        this.connection = connection;
    }
    Mock.prototype.mockRespond = function (responseOptions) {
        this.connection.mockRespond(new _angular_http.Response(new _angular_http.ResponseOptions(responseOptions)));
    };
    Mock.prototype.mockError = function (responseOptions) {
        this.connection.mockError(new MockError(responseOptions));
    };
    return Mock;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AuthMock = (function (_super) {
    __extends$1(AuthMock, _super);
    function AuthMock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.users = AuthMock.getUsers();
        return _this;
    }
    AuthMock.getUsers = function () {
        var localStorageUsers = localStorage.getItem('users');
        var users = localStorageUsers ? JSON.parse(localStorageUsers) : [];
        if (users.length === 0) {
            var avatar = 'http://via.placeholder.com/160x160/F1F1F2';
            users = [{
                    'id': 1,
                    'authorizationSimpleToken': '1',
                    'firstName': 'Francisco',
                    'lastName': 'Rodríguez',
                    'secondLastName': 'Fernández',
                    'phone': '+56293214008',
                    'cellPhone': '+56993214008',
                    'email': 'frodriguez@option.cl',
                    'bornDate': null,
                    'sex': null,
                    'healthCare': null,
                    'password': 'a12345678',
                    'avatar': avatar
                }];
            localStorage.setItem('users', JSON.stringify(users));
        }
        return users;
    };
    AuthMock.getUserByAuthorizationSimpleToken = function (token) {
        var filteredUsers = AuthMock.getUsers().filter(function (user) {
            return user.authorizationSimpleToken === token;
        });
        return filteredUsers[0];
    };
    AuthMock.prototype.requests = function () {
        // array in local storage for registered users
        var localStorageUsers = localStorage.getItem('users');
        var users = localStorageUsers ? JSON.parse(localStorageUsers) : [];
        // authenticate
        if (this.connection.request.url.endsWith('/login') && this.connection.request.method === _angular_http.RequestMethod.Post) {
            // get parameters from post request
            var params = JSON.parse(this.connection.request.getBody());
            var credentials = params.credentials;
            var authorizationBody = this.login(credentials.username, credentials.password);
            if (authorizationBody) {
                this.mockRespond({
                    status: 200,
                    body: authorizationBody
                });
            }
            else {
                // // else return 400 bad request
                this.mockError({
                    status: 401,
                    statusText: 'Username or password is incorrect'
                });
            }
            return true;
        }
        if (this.connection.request.url.endsWith('/register') && this.connection.request.method === _angular_http.RequestMethod.Post) {
            // get object from post body
            var requestBody = JSON.parse(this.connection.request.getBody());
            // get form data
            var newUser_1 = requestBody[Object.keys(requestBody)[0]];
            // validation
            var duplicateUser = users.filter(function (user) {
                return user.email === newUser_1.email;
            }).length;
            if (duplicateUser) {
                this.mockError({
                    status: 400,
                    statusText: 'Username ' + newUser_1.username + ' is already taken'
                });
                return true;
            }
            // save new user
            newUser_1.id = users.length + 1;
            var body = this.createAuthorizationBody(newUser_1);
            newUser_1.authorizationSimpleToken = body.authorization.simpleToken;
            users.push(newUser_1);
            localStorage.setItem('users', JSON.stringify(users));
            // respond 200 OK
            this.mockRespond({ status: 200, body: body });
            return true;
        }
        if (this.connection.request.url.endsWith('/reset/send-email') && this.connection.request.method === _angular_http.RequestMethod.Post) {
            // get object from post body
            var requestBody = JSON.parse(this.connection.request.getBody());
            // respond 200 OK
            this.mockRespond({ status: 200, body: {} });
            return true;
        }
        var getOneRegex = new RegExp('reset-password/' + '.*$');
        if (this.connection.request.url.match(getOneRegex) && this.connection.request.method === _angular_http.RequestMethod.Post) {
            // get object from post body
            var requestBody = JSON.parse(this.connection.request.getBody());
            // respond 200 OK
            this.mockRespond({ status: 200, body: {} });
            return true;
        }
        return false;
    };
    AuthMock.prototype.login = function (username, password) {
        // find if any user matches login credentials
        var filteredUsers = this.users.filter(function (user) {
            return user.username === username && user.password === password;
        });
        if (filteredUsers.length) {
            // if login details are valid return 200 OK with user details and fake jwt token
            var user = filteredUsers[0];
            return this.createAuthorizationBody(user);
        }
    };
    AuthMock.prototype.createAuthorizationBody = function (user) {
        var simpleToken = user.id + '';
        return {
            authorization: {
                simpleToken: simpleToken
            }
        };
    };
    return AuthMock;
}(Mock));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RestMock = (function (_super) {
    __extends$4(RestMock, _super);
    function RestMock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // array in local storage for registered resources
        _this.localStorageResources = localStorage.getItem(_this.getLocalStorageKey());
        _this.resources = _this.localStorageResources ? JSON.parse(_this.localStorageResources) : [];
        return _this;
    }
    RestMock.prototype.hasSecurityMock = function () {
        return true;
    };
    RestMock.prototype.generateBody = function (result) {
        var body = {
            filterBy: [],
            limit: 20,
            offset: 0,
            orderBy: [],
            pretty: false,
            resultDescription: this.getResourceName(),
            select: [],
            result: result
        };
        if (Array.isArray(result)) {
            body.total = result.length || 1;
        }
        return body;
    };
    RestMock.prototype.isAuthorizedUser = function () {
        var authorizationSimpleToken = this.connection.request.headers.get('Authorization') || '';
        return !!AuthMock.getUserByAuthorizationSimpleToken(authorizationSimpleToken);
    };
    RestMock.prototype.requests = function () {
        // get all resources
        var isEndsWith = this.connection.request.url.endsWith(this.getResourceEndpoint());
        var getAllParamsRegex = new RegExp(this.getResourceEndpoint() + '\\?');
        var isGetAllParams = this.connection.request.url.match(getAllParamsRegex);
        if ((isEndsWith || isGetAllParams) && this.connection.request.method === _angular_http.RequestMethod.Get) {
            // check for fake auth token in header and return resources if valid, this security is implemented server side in a real application
            if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
                // respond 200 OK with resources
                this.mockRespond({ status: 200, body: this.generateBody(this.resources) });
            }
            else {
                // return 401 not authorised if token is null or invalid
                this.mockError({
                    status: 400,
                    statusText: 'not authorized'
                });
            }
            return true;
        }
        // get resources by id
        var getOneRegex = new RegExp(this.getResourceEndpoint() + '/' + '\\d+$');
        if (this.connection.request.url.match(getOneRegex) && this.connection.request.method === _angular_http.RequestMethod.Get) {
            // check for fake auth token in header and return resource if valid, this security is implemented server side in a real application
            if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
                // find resource by id in resources array
                var urlParts = this.connection.request.url.split('/');
                var id_1 = Number.parseInt(urlParts[urlParts.length - 1]);
                var matchedResources = this.resources.filter(function (resource) {
                    return resource.id === id_1;
                });
                var resource = matchedResources.length ? matchedResources[0] : null;
                // respond 200 OK with resource
                this.mockRespond({ status: 200, body: this.generateBody(resource) });
            }
            else {
                // return 401 not authorised if token is null or invalid
                this.mockError({
                    status: 400,
                    statusText: 'not authorized'
                });
            }
            return true;
        }
        // create resource
        if (this.connection.request.url.endsWith(this.getResourceEndpoint()) && this.connection.request.method === _angular_http.RequestMethod.Post) {
            // get object from post body
            var requestBody = JSON.parse(this.connection.request.getBody());
            // get form data
            var newResource = requestBody[Object.keys(requestBody)[0]];
            if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
                // validation
                // const duplicateResource = resources.filter(resource => {
                //   return resource.username === newResource.username;
                // }).length;
                //
                // if (duplicateResource) {
                //   this.connection.mockError(new Error('Resourcename ' + newResource.username + ' is already taken'));
                //   return true;
                // }
                // save new resource
                newResource.id = this.resources.length + 1;
                this.resources.push(newResource);
                localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(this.resources));
                // respond 200 OK
                this.mockRespond({ status: 200 });
            }
            else {
                // return 401 not authorised if token is null or invalid
                this.mockError({
                    status: 400,
                    statusText: 'not authorized'
                });
            }
            return true;
        }
        // get resources by id
        var updateRegex = new RegExp(this.getResourceEndpoint() + '/' + '\\d+$');
        if (this.connection.request.url.match(updateRegex) && this.connection.request.method === _angular_http.RequestMethod.Patch) {
            // get object from patch body
            var requestBody = JSON.parse(this.connection.request.getBody());
            // get form data
            var updateResource = requestBody[Object.keys(requestBody)[0]];
            // check for fake auth token in header and return resource if valid, this security is implemented server side in a real application
            if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
                // find resource by id in resources array
                var urlParts = this.connection.request.url.split('/');
                var id = Number.parseInt(urlParts[urlParts.length - 1]);
                var index = void 0;
                for (index = 0; index < this.resources.length; index++) {
                    var resource = this.resources[index];
                    if (resource.id === id) {
                        break;
                    }
                }
                if (this.resources[index]) {
                    this.resources[index] = Object.assign(this.resources[index], updateResource);
                    localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(this.resources));
                    // respond 200 OK with resource
                    this.mockRespond({ status: 200 });
                }
                else {
                    // return 404 not found resource
                    this.mockError({
                        status: 404,
                        statusText: 'not found'
                    });
                }
            }
            else {
                // return 401 not authorised if token is null or invalid
                this.mockError({
                    status: 400,
                    statusText: 'not authorized'
                });
            }
            return true;
        }
        return false;
    };
    return RestMock;
}(Mock));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var UserMock = (function (_super) {
    __extends$3(UserMock, _super);
    function UserMock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserMock.prototype.getResourceEndpoint = function () {
        return '/users';
    };
    UserMock.prototype.getLocalStorageKey = function () {
        return 'users';
    };
    UserMock.prototype.getResourceName = function () {
        return 'users';
    };
    UserMock.prototype.requests = function () {
        var requestUrl = this.connection.request.url;
        var requestMethod = this.connection.request.method;
        var meRequest = this.getResourceEndpoint() + '/me';
        if (requestUrl.endsWith(meRequest) && requestMethod === _angular_http.RequestMethod.Get) {
            // check for fake auth token in header and return resources if valid, this security is implemented server side in a real application
            if (this.isAuthorizedUser()) {
                var authorizationSimpleToken = this.connection.request.headers.get('Authorization') || '';
                var currentUser = AuthMock.getUserByAuthorizationSimpleToken(authorizationSimpleToken);
                var body = this.generateBody(currentUser);
                // respond 200 OK with resources
                this.mockRespond({ status: 200, body: body });
            }
            else {
                // return 401 not authorised if token is null or invalid
                this.mockError({ status: 401 });
            }
            return true;
        }
        var changePasswordRequest = this.getResourceEndpoint() + '/me/password';
        if (requestUrl.endsWith(changePasswordRequest) && requestMethod === _angular_http.RequestMethod.Post) {
            // check for fake auth token in header and return resources if valid, this security is implemented server side in a real application
            if (this.isAuthorizedUser()) {
                // get object from post body
                var requestBody = JSON.parse(this.connection.request.getBody());
                var authorizationSimpleToken = this.connection.request.headers.get('Authorization') || '';
                var currentUser = AuthMock.getUserByAuthorizationSimpleToken(authorizationSimpleToken);
                if (currentUser.password === requestBody.oldPassword) {
                    var index = void 0;
                    for (index = 0; index < this.resources.length; index++) {
                        var resource = this.resources[index];
                        if (resource.id === currentUser.id) {
                            break;
                        }
                    }
                    // change password
                    currentUser.password = requestBody.password;
                    this.resources[index] = Object.assign(this.resources[index], currentUser);
                    // update user on local storage
                    localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(this.resources));
                    // respond 200 OK with resource
                    this.mockRespond({ status: 200 });
                }
                else {
                    // return 400 bad request, the password is incorrect
                    this.mockError({ status: 400, message: 'incorrect password' });
                }
            }
            else {
                // return 401 not authorised if token is null or invalid
                this.mockError({ status: 401 });
            }
            return true;
        }
        return _super.prototype.requests.call(this);
    };
    
    return UserMock;
}(RestMock));

function fakeBackendFactory(backend, options, realBackend) {
    // configure fake backend
    backend.connections.subscribe(function (connection) {
        // wrap in timeout to simulate server api call
        setTimeout(function () {
            var authMock = new AuthMock(connection);
            if (authMock.requests()) {
                return;
            }
            var userMock = new UserMock(connection);
            if (userMock.requests()) {
                return;
            }
            // pass through any requests not handled above
            var realHttp = new _angular_http.Http(realBackend, options);
            var requestOptions = new _angular_http.RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe(function (response) {
                connection.mockRespond(response);
            }, function (error) {
                connection.mockError(error);
            });
        }, 500);
    });
    return new _angular_http.Http(backend, options);
}

var fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: _angular_http.Http,
    useFactory: fakeBackendFactory,
    deps: [_angular_http_testing.MockBackend, _angular_http.BaseRequestOptions, _angular_http.XHRBackend]
};

// @Component({
//   selector: 'opt-form',
//   templateUrl: './form.component.html'
// })
var OptFormComponent = (function () {
    function OptFormComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.submitted = false;
        this.serverMessage = {
            message: 'Server message',
            show: false,
            isStatusOk: true
        };
        this.SERVER_MESSAGES = {
            401: 'Unauthorized message',
            403: 'Forbidden message',
            500: 'Server error',
            '*': 'Default error'
        };
        /**
         *
         * @example {
         *   field1: '',
         *   field2: ''
         * }
         */
        this.formErrors = {};
        /**
         * @example {
         *   field1: {
         *     'required': 'Field 1 is required',
         *     'email': 'Invalid email'
         *   },
         *   field2: {
         *     'required': 'Field 2 is required',
         *     'minlength': 'Field 2 must be at least 8 characters long'
         *   }
         * }
         */
        this.VALIDATION_MESSAGES = {};
        /**
         * @example {
         *   field1: 'Field 1',
         *   field2: 'Field 2'
         * }
         */
        this.PLACEHOLDERS = {};
        this.SUBMIT_LABEL = 'Submit label';
        // attribute for first param function of the https://angular.io/api/forms/FormBuilder#group
        this.formBuilderGroupControlsConfig = {
            field1: [
                null, [_angular_forms.Validators.required, _angular_forms.Validators.email]
            ],
            field2: [
                null, [_angular_forms.Validators.required, _angular_forms.Validators.minLength(8)]
            ]
        };
    }
    OptFormComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    OptFormComponent.prototype.isFromValid = function () {
        return this.form.valid;
    };
    OptFormComponent.prototype.setServerMessage = function (statusCode, isSuccessMessage) {
        if (isSuccessMessage === void 0) { isSuccessMessage = false; }
        this.serverMessage.message = this.SERVER_MESSAGES[statusCode];
        if (!this.serverMessage.message) {
            this.serverMessage.message = this.SERVER_MESSAGES['*'];
        }
        this.serverMessage.show = true;
        this.serverMessage.isStatusOk = isSuccessMessage;
    };
    OptFormComponent.prototype.onSubmit = function () {
        var self = this;
        self.submitted = true;
        self.onValueChanged();
        if (self.isFromValid()) {
            this.submit();
        }
    };
    OptFormComponent.prototype.buildForm = function () {
        var _this = this;
        // Build login form
        this.form = this.formBuilder.group(this.formBuilderGroupControlsConfig, this.formBuilderGroupExtra);
        this.form.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    };
    OptFormComponent.prototype.onValueChanged = function (data) {
        if (!this.form) {
            return;
        }
        var form = this.form;
        for (var field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if ((control && control.dirty && !control.valid) || (control && this.submitted)) {
                if (!control.errors) {
                    continue;
                }
                var messages = this.VALIDATION_MESSAGES[field];
                for (var key in control.errors) {
                    if (!control.errors.hasOwnProperty(key)) {
                        continue;
                    }
                    if (this.formErrors[field] === '') {
                        this.formErrors[field] = messages[key];
                    }
                }
            }
        }
    };
    return OptFormComponent;
}());

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 */
var OptUser = (function (_super) {
    __extends$5(OptUser, _super);
    function OptUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptUser.prototype.getFormEntityName = function () {
        return 'user';
    };
    OptUser.prototype.toRegisterForm = function () {
        var formContent = _super.prototype.getFormContent.call(this);
        Object.keys(formContent).map(function (key) {
            var attribute = formContent[key];
            if (key === 'password') {
                formContent['plainPassword'] = {
                    'first': attribute,
                    'second': attribute
                };
            }
        });
        return { 'register': formContent };
    };
    OptUser.prototype.decode = function (jsonObject) {
        this.id = jsonObject['id'];
        this.fullName = jsonObject['fullName'];
        this.username = jsonObject['username'];
        this.password = jsonObject['password'];
        this.email = jsonObject['email'];
        this.roles = jsonObject['roles'];
        this.phoneNumber = jsonObject['phoneNumber'];
    };
    OptUser.prototype.setFullName = function (firstName, lastName) {
        this.fullName = firstName + ' ' + lastName;
    };
    return OptUser;
}(OptEntity));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var OptUserService = (function (_super) {
    __extends$6(OptUserService, _super);
    function OptUserService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptUserService.prototype.getEntityBaseUrl = function () {
        return this.getBaseUrl() + '/users';
    };
    OptUserService.prototype.createEntity = function (json) {
        return new OptUser(json);
    };
    OptUserService.prototype.getMe = function () {
        var self = this;
        if (this.getMeObservable) {
            return this.getMeObservable;
        }
        return this.getMeObservable = this.http
            .get(this.getEntityBaseUrl() + '/me', { headers: this.getHeaders() })
            .map(function (response) {
            self.getMeObservable = null;
            return self.createEntity(response.json().result);
        })
            .catch(this.handleError);
    };
    OptUserService.prototype.changePassword = function (actualPassword, newPassword, confirmationPassword) {
        var body = {
            oldPassword: actualPassword,
            password: newPassword,
            passwordConfirmation: confirmationPassword
        };
        return this.http
            .post(this.getEntityBaseUrl() + '/me/password', JSON.stringify(body), { headers: this.getHeaders() })
            .map(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    return OptUserService;
}(OptRestService));
OptUserService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptUserService.ctorParameters = function () { return []; };

exports.MODULE_CONFIG = MODULE_CONFIG;
exports.OptionCoreModule = OptionCoreModule;
exports.OptEntity = OptEntity;
exports.OptResponse = OptResponse;
exports.FilterFactory = FilterFactory;
exports.Filter = Filter;
exports.FilterBy = FilterBy;
exports.OrderBy = OrderBy;
exports.Select = Select;
exports.Search = Search;
exports.Limit = Limit;
exports.Offset = Offset;
exports.Extra = Extra;
exports.Total = Total;
exports.OptFilteredResponse = OptFilteredResponse;
exports.OptPasswordValidation = OptPasswordValidation;
exports.OptRestService = OptRestService;
exports.OptAuthService = OptAuthService;
exports.OptAuthGuard = OptAuthGuard;
exports.AuthMock = AuthMock;
exports.fakeBackendFactory = fakeBackendFactory;
exports.fakeBackendProvider = fakeBackendProvider;
exports.MockError = MockError;
exports.Mock = Mock;
exports.RestMock = RestMock;
exports.UserMock = UserMock;
exports.OptFormComponent = OptFormComponent;
exports.OptLazyScriptService = OptLazyScriptService;
exports.OptUser = OptUser;
exports.OptUserService = OptUserService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
