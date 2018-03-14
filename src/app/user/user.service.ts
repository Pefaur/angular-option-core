import { Injectable } from '@angular/core';

import { OptUser } from './user.model';
import { OptRestService } from '../common/rest.service';
import { OptResponse } from '../common/response.model';

@Injectable()
export class OptUserService extends OptRestService {

  private user: OptUser;

  getEntityBaseUrl(): string {
    return this.getBaseUrl() + '/users';
  }

  createEntity(json: any): OptUser {
    return new OptUser(json);
  }

  getMe(): Promise<OptUser> {
    if (this.user) {
      return Promise.resolve(this.user);
    }
    const self = this;
    return this.http
      .get(this.getEntityBaseUrl() + '/me', {headers: this.getHeaders()})
      .toPromise()
      .then(function(response: any) {
        return self.user = self.createEntity(response.json().result);
      })
      .catch(this.handleError);
  }

  changePassword(actualPassword: string, newPassword: string, confirmationPassword: string) {
    const body = {
      oldPassword: actualPassword,
      password: newPassword,
      passwordConfirmation: confirmationPassword
    };
    return this.http
      .post(this.getEntityBaseUrl() + '/me/password', JSON.stringify(body), {headers: this.getHeaders()})
      .toPromise()
      .then(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }
}
