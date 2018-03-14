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
import { RequestMethod } from '@angular/http';
import { Mock } from './mock';
import { AuthMock } from './auth-mock';
var RestMock = (function (_super) {
    __extends(RestMock, _super);
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
        if ((isEndsWith || isGetAllParams) && this.connection.request.method === RequestMethod.Get) {
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
        if (this.connection.request.url.match(getOneRegex) && this.connection.request.method === RequestMethod.Get) {
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
        if (this.connection.request.url.endsWith(this.getResourceEndpoint()) && this.connection.request.method === RequestMethod.Post) {
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
        if (this.connection.request.url.match(updateRegex) && this.connection.request.method === RequestMethod.Patch) {
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
export { RestMock };
//# sourceMappingURL=rest-mock.js.map