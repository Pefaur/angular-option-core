import { Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
export declare function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend): Http;
