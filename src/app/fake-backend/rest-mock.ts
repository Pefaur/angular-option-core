import { RequestMethod } from '@angular/http';
import { Mock } from './mock';
import { AuthMock } from './auth-mock';

export abstract class RestMock extends Mock {
  // array in local storage for registered resources
  localStorageResources = localStorage.getItem(this.getLocalStorageKey());
  resources: any[] = this.localStorageResources ? JSON.parse(this.localStorageResources) : [];

  abstract getResourceEndpoint(): string;

  abstract getLocalStorageKey(): string;

  abstract getResourceName(): string;

  hasSecurityMock(): boolean {
    return true;
  }

  generateBody(result: object[] | object): object {
    const body: any = {
      filterBy: [],
      limit: 20,
      offset: 0,
      orderBy: [],
      pretty: false,
      resultDescription: this.getResourceName(),
      select: [],
      result: result
    };
    if (Array.isArray(result)) {
      body.total = result.length || 1;
    }
    return body;
  }

  isAuthorizedUser(): boolean {
    const authorizationSimpleToken = this.connection.request.headers.get('Authorization') || '';
    return !!AuthMock.getUserByAuthorizationSimpleToken(authorizationSimpleToken);
  }

  requests(): boolean {
    // get all resources
    if (this.connection.request.url.endsWith(this.getResourceEndpoint()) && this.connection.request.method === RequestMethod.Get) {
      // check for fake auth token in header and return resources if valid, this security is implemented server side in a real application
      if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
        // respond 200 OK with resources
        this.mockRespond({status: 200, body: this.generateBody(this.resources)});
      } else {
        // return 401 not authorised if token is null or invalid
        this.mockError({
          status: 400,
          statusText: 'not authorized'
        });
      }

      return true;
    }

    // get resources by id
    const getOneRegex = new RegExp(this.getResourceEndpoint() + '/' + '\\d+$');
    if (this.connection.request.url.match(getOneRegex) && this.connection.request.method === RequestMethod.Get) {
      // check for fake auth token in header and return resource if valid, this security is implemented server side in a real application
      if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
        // find resource by id in resources array
        const urlParts = this.connection.request.url.split('/');
        const id = Number.parseInt(urlParts[urlParts.length - 1]);
        const matchedResources = this.resources.filter(resource => {
          return resource.id === id;
        });
        const resource = matchedResources.length ? matchedResources[0] : null;

        // respond 200 OK with resource
        this.mockRespond({status: 200, body: this.generateBody(resource)});
      } else {
        // return 401 not authorised if token is null or invalid
        this.mockError({
          status: 400,
          statusText: 'not authorized'
        });
      }

      return true;
    }

    // create resource
    if (this.connection.request.url.endsWith(this.getResourceEndpoint()) && this.connection.request.method === RequestMethod.Post) {
      // get object from post body
      const requestBody = JSON.parse(this.connection.request.getBody());
      // get form data
      const newResource = requestBody[Object.keys(requestBody)[0]];
      if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
        // validation
        // const duplicateResource = resources.filter(resource => {
        //   return resource.username === newResource.username;
        // }).length;
        //
        // if (duplicateResource) {
        //   this.connection.mockError(new Error('Resourcename ' + newResource.username + ' is already taken'));
        //   return true;
        // }

        // save new resource
        newResource.id = this.resources.length + 1;
        this.resources.push(newResource);
        localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(this.resources));

        // respond 200 OK
        this.mockRespond({status: 200});
      } else {
        // return 401 not authorised if token is null or invalid
        this.mockError({
          status: 400,
          statusText: 'not authorized'
        });
      }
      return true;
    }

    // get resources by id
    const updateRegex = new RegExp(this.getResourceEndpoint() + '/' + '\\d+$');
    if (this.connection.request.url.match(updateRegex) && this.connection.request.method === RequestMethod.Patch) {
      // get object from patch body
      const requestBody = JSON.parse(this.connection.request.getBody());
      // get form data
      const updateResource = requestBody[Object.keys(requestBody)[0]];

      // check for fake auth token in header and return resource if valid, this security is implemented server side in a real application
      if (!this.hasSecurityMock() || this.isAuthorizedUser()) {
        // find resource by id in resources array
        const urlParts = this.connection.request.url.split('/');
        const id = Number.parseInt(urlParts[urlParts.length - 1]);

        let index;
        for (index = 0; index < this.resources.length; index++) {
          const resource = this.resources[index];
          if (resource.id === id) {
            break;
          }
        }
        if (this.resources[index]) {
          this.resources[index] = Object.assign(this.resources[index], updateResource);
          localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(this.resources));
          // respond 200 OK with resource
          this.mockRespond({status: 200});
        } else {
          // return 404 not found resource
          this.mockError({
            status: 404,
            statusText: 'not found'
          });
        }
      } else {
        // return 401 not authorised if token is null or invalid
        this.mockError({
          status: 400,
          statusText: 'not authorized'
        });
      }

      return true;
    }

    return false;
  }
}
