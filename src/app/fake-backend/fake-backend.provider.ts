import { BaseRequestOptions, Http, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { fakeBackendFactory } from './fake-backend.factory';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: fakeBackendFactory,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
