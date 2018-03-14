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
import { Injectable } from '@angular/core';
import { OptUser } from './user.model';
import { OptRestService } from '../shared/rest.service';
import { OptResponse } from '../shared/response';
var OptUserService = (function (_super) {
    __extends(OptUserService, _super);
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
export { OptUserService };
OptUserService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
OptUserService.ctorParameters = function () { return []; };
//# sourceMappingURL=user.service.js.map