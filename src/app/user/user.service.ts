import { Injectable } from '@angular/core';

import { OptUser } from './user.model';
import { OptRestService } from '../shared/rest.service';
import { OptResponse } from '../shared/response';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class OptUserService extends OptRestService {

  protected getMeObservable: Observable<OptUser> | null;

  getEntityBaseUrl(): string {
    return this.getBaseUrl() + '/users';
  }

  createEntity(json: any): OptUser {
    return new OptUser(json);
  }

  getMe(): Observable<OptUser> {
    const self = this;
    if (this.getMeObservable) {
      return this.getMeObservable;
    }
    return this.getMeObservable = this.http
      .get(this.getEntityBaseUrl() + '/me', {headers: this.getHeaders()})
      .map(function (response: any) {
        self.getMeObservable = null;
        return self.createEntity(response.json().result);
      })
      .catch(this.handleError);
  }

  changePassword(actualPassword: string, newPassword: string, confirmationPassword: string): Observable<OptResponse> {
    const body = {
      oldPassword: actualPassword,
      password: newPassword,
      passwordConfirmation: confirmationPassword
    };
    return this.http
      .post(this.getEntityBaseUrl() + '/me/password', JSON.stringify(body), {headers: this.getHeaders()})
      .map(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }
}
