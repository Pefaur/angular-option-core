import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { MODULE_CONFIG } from '../option-core.config';
import { OptResponse } from './response';
import { OptAuthService } from './auth.service';
import { FilterFactory } from './filter';
import { OptFilteredResponse } from './filtered-response';
var OptRestService = (function () {
    function OptRestService(config, auth, http) {
        this.config = config;
        this.auth = auth;
        this.http = http;
        this.apiVersion = 'v1.0';
        this.defaultHeaders = new Headers({
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
        return new Headers(headers);
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
        return Observable.throw(OptResponse.fromJSON(error));
    };
    return OptRestService;
}());
export { OptRestService };
OptRestService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
OptRestService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [MODULE_CONFIG,] },] },
    { type: OptAuthService, },
    { type: Http, },
]; };
//# sourceMappingURL=rest.service.js.map