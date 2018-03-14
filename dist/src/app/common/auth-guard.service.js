import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OptAuthService } from './auth.service';
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
export { OptAuthGuard };
OptAuthGuard.decorators = [
    { type: Injectable },
];
/** @nocollapse */
OptAuthGuard.ctorParameters = function () { return [
    { type: OptAuthService, },
    { type: Router, },
]; };
//# sourceMappingURL=auth-guard.service.js.map