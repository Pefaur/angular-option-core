import { Mock } from './mock';
export declare abstract class RestMock extends Mock {
    localStorageResources: string | null;
    resources: any[];
    abstract getResourceEndpoint(): string;
    abstract getLocalStorageKey(): string;
    abstract getResourceName(): string;
    hasSecurityMock(): boolean;
    generateBody(result: object[] | object): object;
    isAuthorizedUser(): boolean;
    requests(): boolean;
}
