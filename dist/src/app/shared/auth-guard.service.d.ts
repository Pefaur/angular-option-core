import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { OptAuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
export declare class OptAuthGuard implements CanActivate, CanActivateChild {
    protected authService: OptAuthService;
    protected router: Router;
    loginRoute: string;
    constructor(authService: OptAuthService, router: Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
    canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot): boolean;
    checkLogin(url: string): boolean;
    checkLogout(url: string): boolean;
}
