import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { OptResponse } from './response.model';
import { API_URL } from './api-url.config';
import 'rxjs/add/operator/toPromise';
var OptAuthService = (function () {
    function OptAuthService(baseUrl, http) {
        this.baseUrl = baseUrl;
        this.http = http;
        this.headers = new Headers({ 'Content-Type': 'application/json' });
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
    ;
    OptAuthService.prototype.handleError = function (error) {
        return Promise.reject(OptResponse.fromJSON(error));
    };
    return OptAuthService;
}());
export { OptAuthService };
OptAuthService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
OptAuthService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [API_URL,] },] },
    { type: Http, },
]; };
//# sourceMappingURL=auth.service.js.map