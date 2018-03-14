import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { OptUser } from '../user/user.model';
import { OptResponse } from './response';
import { MODULE_CONFIG, OptionCoreConfig } from '../option-core.config';

import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OptAuthService {
  protected headers = new Headers({'Content-Type': 'application/json'});
  public redirectUrl: string;
  protected baseUrl: string;

  constructor(@Inject(MODULE_CONFIG) protected config: OptionCoreConfig, protected http: Http) {
    this.baseUrl = config.apiUrl;
  }

  register(user: OptUser): Observable<OptResponse> {
    return this.http
      .post(this.baseUrl + '/register', JSON.stringify(user.toRegisterForm()), {headers: this.headers})
      .map(response => {
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  login(email: string, password: String): Observable<OptResponse> {
    const credentials = {
      'credentials': {
        'username': email,
        'password': password
      }
    };

    return this.http
      .post(this.baseUrl + '/login', JSON.stringify(credentials), {headers: this.headers})
      .map(response => {
        this.setToken(response.json().authorization.simpleToken);
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  logout(): Observable<OptResponse> {
    this.clearSession();
    const response = new OptResponse();
    response.isStatusOk = true;
    response.statusCode = 200;
    return Observable.of(response);
  }

  recoverPassword(email: string): Observable<OptResponse> {
    // reset/send-email
    // {username: dcaris@optionti.com}
    const body = {username: email};
    return this.http
      .post(this.baseUrl + '/reset/send-email', JSON.stringify(body), {headers: this.headers})
      .map(function (response: any) {
        return OptResponse.fromJSON(response);
      })
      .catch(this.handleError);
  }

  resetPassword(token: string, password: string, passwordConfirmation: string): Observable<OptResponse> {
    const body = {
      password: password,
      passwordConfirmation: passwordConfirmation
    };
    return this.http
      .post(this.baseUrl + '/reset-password/' + token, JSON.stringify(body), {headers: this.headers})
      .map(function (response: any) {
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

  protected handleError(error: Response): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(OptResponse.fromJSON(error));
  }
}
