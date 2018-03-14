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
        if (this.connection.request.url.endsWith('/login') && this.connection.request.method === RequestMethod.Post) {
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
        if (this.connection.request.url.endsWith('/register') && this.connection.request.method === RequestMethod.Post) {
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
        if (this.connection.request.url.endsWith('/reset/send-email') && this.connection.request.method === RequestMethod.Post) {
            // get object from post body
            var requestBody = JSON.parse(this.connection.request.getBody());
            // respond 200 OK
            this.mockRespond({ status: 200, body: {} });
            return true;
        }
        var getOneRegex = new RegExp('reset-password/' + '.*$');
        if (this.connection.request.url.match(getOneRegex) && this.connection.request.method === RequestMethod.Post) {
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
export { AuthMock };
//# sourceMappingURL=auth-mock.js.map