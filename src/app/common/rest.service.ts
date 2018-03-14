import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { API_URL } from './api-url.config';

import { OptResponse } from './response.model';
import { OptEntity } from './entity.model';
import { OptAuthService } from './auth.service';

@Injectable()
export abstract class OptRestService {
  protected defaultHeaders: Headers;
  protected apiVersion = 'v1.0';

  constructor(@Inject(API_URL) protected apiUrl: string, protected auth: OptAuthService, protected http: Http) {
    this.defaultHeaders = new Headers({
      'Content-Type': 'application/json'
    });
  }

  abstract getEntityBaseUrl(): string;

  abstract createEntity(json: any): OptEntity;

  getBaseUrl(): string {
    return this.apiUrl + '/' + this.apiVersion;
  }

  getHeaders(): Headers {
    const headers = Object.assign(this.defaultHeaders.toJSON(), {
      'Authorization': this.auth.getToken()
    });
    return new Headers(headers);
  }

  getList(): Promise<OptEntity[]> {
    const self = this;
    return this.http.get(this.getEntityBaseUrl(), {headers: this.getHeaders()})
      .toPromise()
      .then(function(response) {
        return response.json().result.map(function(item: JSON) {
          return self.createEntity(item);
        });
      })
      .catch(this.handleError);
  }

  getOne(id: number): Promise<OptEntity> {
    const url = this.getEntityBaseUrl() + '/' + id;
    const self = this;
    return this.http.get(url, {headers: this.getHeaders()})
      .toPromise()
      .then(response => self.createEntity(response.json().result))
      .catch(this.handleError);
  }

  remove(id: number): Promise<OptResponse> {
    const url = this.getEntityBaseUrl() + '/' + id;
    return this.http.delete(url, {headers: this.getHeaders()})
      .toPromise()
      .then(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  create(entity: OptEntity): Promise<OptResponse> {
    return this.http
      .post(this.getEntityBaseUrl(), JSON.stringify(entity.toForm()), {headers: this.getHeaders()})
      .toPromise()
      .then(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  update(entity: OptEntity): Promise<OptResponse> {
    const url = this.getEntityBaseUrl() + '/' + entity.id;
    return this.http
      .patch(url, JSON.stringify(entity.toForm()), {headers: this.getHeaders()})
      .toPromise()
      .then(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  change(entity: OptEntity): Promise<OptResponse> {
    const url = this.getEntityBaseUrl() + '/' + entity.id;
    return this.http
      .put(url, JSON.stringify(entity.toForm()), {headers: this.getHeaders()})
      .toPromise()
      .then(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  protected handleError(error: Response): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(OptResponse.fromJSON(error));
  }
}
