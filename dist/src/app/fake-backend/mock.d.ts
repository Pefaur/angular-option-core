import { Response } from '@angular/http';
import { MockConnection } from '@angular/http/testing';
export declare class MockError extends Response implements Error {
    name: any;
    message: any;
    constructor(responseOptions: object);
}
export declare abstract class Mock {
    protected connection: MockConnection;
    constructor(connection: MockConnection);
    abstract requests(): boolean;
    mockRespond(responseOptions: object): void;
    mockError(responseOptions: object): void;
}
