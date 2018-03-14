import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { OptUser } from '../user/user.model';
import { OptResponse } from './response.model';
import { API_URL } from './api-url.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OptAuthService {
  protected headers = new Headers({'Content-Type': 'application/json'});
  public redirectUrl: string;

  constructor(@Inject(API_URL) private baseUrl: string, private http: Http) {
  }

  register(user: OptUser): Promise<OptResponse> {
    const self = this;
    return this.http
      .post(this.baseUrl + '/register', JSON.stringify(user.toForm()), {headers: this.headers})
      .toPromise()
      .then(function(response: any) {
        self.setToken(response.json().authorization.simpleToken);
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  login(email: string, password: String): Promise<OptResponse> {
    const self = this;
    const credentials = {
      'credentials': {
        'username': email,
        'password': password
      }
    };

    return this.http
      .post(this.baseUrl + '/login', JSON.stringify(credentials), {headers: this.headers})
      .toPromise()
      .then(function(response: any) {
        self.setToken(response.json().authorization.simpleToken);
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  logout(): Promise<OptResponse> {
    this.clearSession();
    const response = new OptResponse();
    response.isStatusOk = true;
    response.statusCode = 200;
    return Promise.resolve(response);
  }

  recoverPassword(email: string): Promise<OptResponse> {
    // reset/send-email
    // {username: dcaris@optionti.com}
    const body = {username: email};
    return this.http
      .post(this.baseUrl + '/reset/send-email', JSON.stringify(body), {headers: this.headers})
      .toPromise()
      .then(function(response: any) {
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  resetPassword(token: string, password: string, passwordConfirmation: string): Promise<OptResponse> {
    const body = {
      password: password,
      passwordConfirmation: passwordConfirmation
    };
    return this.http
      .post(this.baseUrl + '/reset-password/' + token, JSON.stringify(body), {headers: this.headers})
      .toPromise()
      .then(function(response: any) {
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    this.removeToken();
  }

  removeToken() {
    localStorage.removeItem('authorization_token');
  }

  setToken(token: string) {
    localStorage.setItem('authorization_token', token);
  }

  getToken(): string {
    return (<any>localStorage).getItem('authorization_token');
  };

  private handleError(error: any): Promise<any> {
    return Promise.reject(OptResponse.fromJSON(error));
  }
}
