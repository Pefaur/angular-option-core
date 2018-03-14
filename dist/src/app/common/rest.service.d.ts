import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { OptResponse } from './response.model';
import { OptEntity } from './entity.model';
import { OptAuthService } from './auth.service';
export declare abstract class OptRestService {
    protected apiUrl: string;
    protected auth: OptAuthService;
    protected http: Http;
    protected defaultHeaders: Headers;
    protected apiVersion: string;
    constructor(apiUrl: string, auth: OptAuthService, http: Http);
    abstract getEntityBaseUrl(): string;
    abstract createEntity(json: any): OptEntity;
    getBaseUrl(): string;
    getHeaders(): Headers;
    getList(): Promise<OptEntity[]>;
    getOne(id: number): Promise<OptEntity>;
    remove(id: number): Promise<OptResponse>;
    create(entity: OptEntity): Promise<OptResponse>;
    update(entity: OptEntity): Promise<OptResponse>;
    change(entity: OptEntity): Promise<OptResponse>;
    protected handleError(error: Response): Promise<any>;
}
