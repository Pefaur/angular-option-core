import { Http, BaseRequestOptions, Response, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AuthMock } from './auth-mock';
import { UserMock } from './user-mock';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {

  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    // wrap in timeout to simulate server api call
    setTimeout(() => {

      const authMock = new AuthMock(connection);
      if (authMock.requests()) {
        return;
      }

      const userMock = new UserMock(connection);
      if (userMock.requests()) {
        return;
      }

      // pass through any requests not handled above
      const realHttp = new Http(realBackend, options);
      const requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions)
        .subscribe((response: Response) => {
            connection.mockRespond(response);
          },
          (error: any) => {
            connection.mockError(error);
          });
    }, 500);
  });

  return new Http(backend, options);
}
