import { Http, RequestOptions } from '@angular/http';
import { AuthMock } from './auth-mock';
import { UserMock } from './user-mock';
export function fakeBackendFactory(backend, options, realBackend) {
    // configure fake backend
    backend.connections.subscribe(function (connection) {
        // wrap in timeout to simulate server api call
        setTimeout(function () {
            var authMock = new AuthMock(connection);
            if (authMock.requests()) {
                return;
            }
            var userMock = new UserMock(connection);
            if (userMock.requests()) {
                return;
            }
            // pass through any requests not handled above
            var realHttp = new Http(realBackend, options);
            var requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe(function (response) {
                connection.mockRespond(response);
            }, function (error) {
                connection.mockError(error);
            });
        }, 500);
    });
    return new Http(backend, options);
}
//# sourceMappingURL=fake-backend.factory.js.map