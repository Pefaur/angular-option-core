import { OptUser } from './user.model';
import { OptRestService } from '../common/rest.service';
import { OptResponse } from '../common/response.model';
export declare class OptUserService extends OptRestService {
    private user;
    getEntityBaseUrl(): string;
    createEntity(json: any): OptUser;
    getMe(): Promise<OptUser>;
    changePassword(actualPassword: string, newPassword: string, confirmationPassword: string): Promise<OptResponse>;
}
