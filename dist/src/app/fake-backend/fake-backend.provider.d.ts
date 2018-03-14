import { BaseRequestOptions, Http, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
export declare let fakeBackendProvider: {
    provide: typeof Http;
    useFactory: (backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) => Http;
    deps: (typeof MockBackend | typeof BaseRequestOptions | typeof XHRBackend)[];
};
