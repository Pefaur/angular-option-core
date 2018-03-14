(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/http'), require('rxjs/add/operator/toPromise'), require('@angular/router'), require('@angular/http/testing'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/http', 'rxjs/add/operator/toPromise', '@angular/router', '@angular/http/testing', '@angular/forms'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}),global.ng.core,global._angular_common,global._angular_http,null,global._angular_router,global._angular_http_testing,global._angular_forms));
}(this, (function (exports,_angular_core,_angular_common,_angular_http,rxjs_add_operator_toPromise,_angular_router,_angular_http_testing,_angular_forms) { 'use strict';

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

var API_URL = new _angular_core.InjectionToken('apiUrl.config');

var OptAuthService = (function () {
    function OptAuthService(baseUrl, http) {
        this.baseUrl = baseUrl;
        this.http = http;
        this.headers = new _angular_http.Headers({ 'Content-Type': 'application/json' });
    }
    OptAuthService.prototype.register = function (user) {
        var self = this;
        return this.http
            .post(this.baseUrl + '/register', JSON.stringify(user.toForm()), { headers: this.headers })
            .toPromise()
            .then(function (response) {
            self.setToken(response.json().authorization.simpleToken);
            return OptResponse.fromJSON(response);
        })
            .catch(this.handleError);
    };
    OptAuthService.prototype.login = function (email, password) {
        var self = this;
        var credentials = {
            'credentials': {
                'username': email,
                'password': password
            }
        };
        return this.http
            .post(this.baseUrl + '/login', JSON.stringify(credentials), { headers: this.headers })
            .toPromise()
            .then(function (response) {
            self.setToken(response.json().authorization.simpleToken);
            return OptResponse.fromJSON(response);
        })
            .catch(this.handleError);
    };
    OptAuthService.prototype.logout = function () {
        this.clearSession();
        var response = new OptResponse();
        response.isStatusOk = true;
        response.statusCode = 200;
        return Promise.resolve(response);
    };
    OptAuthService.prototype.recoverPassword = function (email) {
        // reset/send-email
        // {username: dcaris@optionti.com}
        var body = { username: email };
        return this.http
            .post(this.baseUrl + '/reset/send-email', JSON.stringify(body), { headers: this.headers })
            .toPromise()
            .then(function (response) {
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
            .toPromise()
            .then(function (response) {
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
        return Promise.reject(OptResponse.fromJSON(error));
    };
    return OptAuthService;
}());
OptAuthService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptAuthService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [API_URL,] },] },
    { type: _angular_http.Http, },
]; };

var OptionCoreModule = (function () {
    function OptionCoreModule() {
    }
    OptionCoreModule.forRoot = function (apiUrl) {
        return {
            ngModule: OptionCoreModule,
            providers: [OptAuthService, { provide: API_URL, useValue: apiUrl }]
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
     * Get form object of the entity
     */
    OptEntity.prototype.getFormContent = function () {
        var formContent = {};
        var self = this;
        Object.keys(this).map(function (key) {
            var attribute = self[key];
            if (key !== 'id') {
                if (attribute instanceof OptEntity && attribute.id) {
                    formContent[key] = attribute.id;
                }
                else if (Array.isArray(attribute)) {
                    if (attribute.length > 0) {
                        formContent[key] = [];
                        attribute.map(function (subAttribute) {
                            formContent[key].push(subAttribute.getFormContent());
                        });
                    }
                }
                else {
                    formContent[key] = attribute;
                }
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
    function OptRestService(apiUrl, auth, http) {
        this.apiUrl = apiUrl;
        this.auth = auth;
        this.http = http;
        this.apiVersion = 'v1.0';
        this.defaultHeaders = new _angular_http.Headers({
            'Content-Type': 'application/json'
        });
    }
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
        var self = this;
        return this.http.get(this.getEntityBaseUrl(), { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) {
            return response.json().result.map(function (item) {
                return self.createEntity(item);
            });
        })
            .catch(this.handleError);
    };
    OptRestService.prototype.getOne = function (id) {
        var url = this.getEntityBaseUrl() + '/' + id;
        var self = this;
        return this.http.get(url, { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) { return self.createEntity(response.json().result); })
            .catch(this.handleError);
    };
    OptRestService.prototype.remove = function (id) {
        var url = this.getEntityBaseUrl() + '/' + id;
        return this.http.delete(url, { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.create = function (entity) {
        return this.http
            .post(this.getEntityBaseUrl(), JSON.stringify(entity.toForm()), { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.update = function (entity) {
        var url = this.getEntityBaseUrl() + '/' + entity.id;
        return this.http
            .patch(url, JSON.stringify(entity.toForm()), { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.change = function (entity) {
        var url = this.getEntityBaseUrl() + '/' + entity.id;
        return this.http
            .put(url, JSON.stringify(entity.toForm()), { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    OptRestService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(OptResponse.fromJSON(error));
    };
    return OptRestService;
}());
OptRestService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptRestService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [API_URL,] },] },
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

// Constants

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
var MockError = (function (_super) {
    __extends$1(MockError, _super);
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
var AuthMock = (function (_super) {
    __extends(AuthMock, _super);
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
var RestMock = (function (_super) {
    __extends$3(RestMock, _super);
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
        if (this.connection.request.url.endsWith(this.getResourceEndpoint()) && this.connection.request.method === _angular_http.RequestMethod.Get) {
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
var UserMock = (function (_super) {
    __extends$2(UserMock, _super);
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
            403: 'Forbidden message'
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
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if ((control && control.dirty && !control.valid) || this.submitted) {
                var messages = this.VALIDATION_MESSAGES[field];
                for (var key in control.errors) {
                    if (this.formErrors[field] === '') {
                        this.formErrors[field] = messages[key];
                    }
                }
            }
        }
    };
    return OptFormComponent;
}());

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
/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 */
var OptUser = (function (_super) {
    __extends$4(OptUser, _super);
    function OptUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptUser.prototype.getFormEntityName = function () {
        return 'user';
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
var OptUserService = (function (_super) {
    __extends$5(OptUserService, _super);
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
        if (this.user) {
            return Promise.resolve(this.user);
        }
        var self = this;
        return this.http
            .get(this.getEntityBaseUrl() + '/me', { headers: this.getHeaders() })
            .toPromise()
            .then(function (response) {
            return self.user = self.createEntity(response.json().result);
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
            .toPromise()
            .then(function (response) { return OptResponse.fromJSON(response); })
            .catch(this.handleError);
    };
    return OptUserService;
}(OptRestService));
OptUserService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
OptUserService.ctorParameters = function () { return []; };

exports.OptionCoreModule = OptionCoreModule;
exports.API_URL = API_URL;
exports.OptEntity = OptEntity;
exports.OptResponse = OptResponse;
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
exports.OptUser = OptUser;
exports.OptUserService = OptUserService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
