import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { API_URL } from './api-url.config';
import { OptResponse } from './response.model';
import { OptAuthService } from './auth.service';
var OptRestService = (function () {
    function OptRestService(apiUrl, auth, http) {
        this.apiUrl = apiUrl;
        this.auth = auth;
        this.http = http;
        this.apiVersion = 'v1.0';
        this.defaultHeaders = new Headers({
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
        return new Headers(headers);
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
export { OptRestService };
OptRestService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
OptRestService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [API_URL,] },] },
    { type: OptAuthService, },
    { type: Http, },
]; };
//# sourceMappingURL=rest.service.js.map