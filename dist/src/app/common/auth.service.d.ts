import { Headers, Http } from '@angular/http';
import { OptUser } from '../user/user.model';
import { OptResponse } from './response.model';
import 'rxjs/add/operator/toPromise';
export declare class OptAuthService {
    private baseUrl;
    private http;
    protected headers: Headers;
    redirectUrl: string;
    constructor(baseUrl: string, http: Http);
    register(user: OptUser): Promise<OptResponse>;
    login(email: string, password: String): Promise<OptResponse>;
    logout(): Promise<OptResponse>;
    recoverPassword(email: string): Promise<OptResponse>;
    resetPassword(token: string, password: string, passwordConfirmation: string): Promise<OptResponse>;
    isLoggedIn(): boolean;
    clearSession(): void;
    removeToken(): void;
    setToken(token: string): void;
    getToken(): string;
    private handleError(error);
}
