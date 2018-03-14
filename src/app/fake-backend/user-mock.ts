import { RequestMethod } from '@angular/http';
import { RestMock } from './rest-mock';
import { AuthMock } from './auth-mock';

export class UserMock extends RestMock {

  getResourceEndpoint(): string {
    return '/users';
  }

  getLocalStorageKey(): string {
    return 'users';
  }

  getResourceName(): string {
    return 'users';
  }

  requests(): boolean {
    const requestUrl = this.connection.request.url;
    const requestMethod = this.connection.request.method;

    const meRequest = this.getResourceEndpoint() + '/me';
    if (requestUrl.endsWith(meRequest) && requestMethod === RequestMethod.Get) {
      // check for fake auth token in header and return resources if valid, this security is implemented server side in a real application
      if (this.isAuthorizedUser()) {
        const authorizationSimpleToken = this.connection.request.headers.get('Authorization') || '';
        const currentUser = AuthMock.getUserByAuthorizationSimpleToken(authorizationSimpleToken);
        const body = this.generateBody(currentUser);

        // respond 200 OK with resources
        this.mockRespond({status: 200, body: body});
      } else {
        // return 401 not authorised if token is null or invalid
        this.mockError({status: 401});
      }
      return true;
    }

    const changePasswordRequest = this.getResourceEndpoint() + '/me/password';
    if (requestUrl.endsWith(changePasswordRequest) && requestMethod === RequestMethod.Post) {
      // check for fake auth token in header and return resources if valid, this security is implemented server side in a real application
      if (this.isAuthorizedUser()) {
        // get object from post body
        const requestBody = JSON.parse(this.connection.request.getBody());
        const authorizationSimpleToken = this.connection.request.headers.get('Authorization') || '';
        const currentUser: any = AuthMock.getUserByAuthorizationSimpleToken(authorizationSimpleToken);
        if (currentUser.password === requestBody.oldPassword) {
          let index;
          for (index = 0; index < this.resources.length; index++) {
            const resource = this.resources[index];
            if (resource.id === currentUser.id) {
              break;
            }
          }
          // change password
          currentUser.password = requestBody.password;
          this.resources[index] = Object.assign(this.resources[index], currentUser);
          // update user on local storage
          localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(this.resources));

          // respond 200 OK with resource
          this.mockRespond({status: 200});
        } else {
          // return 400 bad request, the password is incorrect
          this.mockError({status: 400, message: 'incorrect password'});
        }
      } else {
        // return 401 not authorised if token is null or invalid
        this.mockError({status: 401});
      }
      return true;
    }

    return super.requests();
  };
}
