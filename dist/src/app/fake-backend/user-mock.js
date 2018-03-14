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
import { RestMock } from './rest-mock';
import { AuthMock } from './auth-mock';
var UserMock = (function (_super) {
    __extends(UserMock, _super);
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
        if (requestUrl.endsWith(meRequest) && requestMethod === RequestMethod.Get) {
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
        if (requestUrl.endsWith(changePasswordRequest) && requestMethod === RequestMethod.Post) {
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
    ;
    return UserMock;
}(RestMock));
export { UserMock };
//# sourceMappingURL=user-mock.js.map