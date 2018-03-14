import { RestMock } from './rest-mock';
export declare class UserMock extends RestMock {
    getResourceEndpoint(): string;
    getLocalStorageKey(): string;
    getResourceName(): string;
    requests(): boolean;
}
