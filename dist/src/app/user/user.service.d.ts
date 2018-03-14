import { OptUser } from './user.model';
import { OptRestService } from '../shared/rest.service';
import { OptResponse } from '../shared/response';
import { Observable } from 'rxjs/Observable';
export declare class OptUserService extends OptRestService {
    protected getMeObservable: Observable<OptUser> | null;
    getEntityBaseUrl(): string;
    createEntity(json: any): OptUser;
    getMe(): Observable<OptUser>;
    changePassword(actualPassword: string, newPassword: string, confirmationPassword: string): Observable<OptResponse>;
}
