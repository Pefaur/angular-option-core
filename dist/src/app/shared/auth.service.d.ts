import { Headers, Http } from '@angular/http';
import { OptUser } from '../user/user.model';
import { OptResponse } from './response';
import { OptionCoreConfig } from '../option-core.config';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
export declare class OptAuthService {
    protected config: OptionCoreConfig;
    protected http: Http;
    protected headers: Headers;
    redirectUrl: string;
    protected baseUrl: string;
    constructor(config: OptionCoreConfig, http: Http);
    register(user: OptUser): Observable<OptResponse>;
    login(email: string, password: String): Observable<OptResponse>;
    logout(): Observable<OptResponse>;
    recoverPassword(email: string): Observable<OptResponse>;
    resetPassword(token: string, password: string, passwordConfirmation: string): Observable<OptResponse>;
    isLoggedIn(): boolean;
    clearSession(): void;
    removeToken(): void;
    setToken(token: string): void;
    getToken(): string;
    protected handleError(error: Response): Observable<any>;
}
