import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { MODULE_CONFIG, OptionCoreConfig } from '../option-core.config';

import { OptResponse } from './response';
import { OptEntity } from './entity.model';
import { OptAuthService } from './auth.service';
import { FilterFactory, FiltersOptions } from './filter';
import { OptFilteredResponse } from './filtered-response';

@Injectable()
export abstract class OptRestService {
  protected defaultHeaders: Headers;
  protected apiVersion = 'v1.0';
  protected apiUrl: string;

  constructor(@Inject(MODULE_CONFIG) protected config: OptionCoreConfig,
              protected auth: OptAuthService,
              protected http: Http) {
    this.defaultHeaders = new Headers({
      'Content-Type': 'application/json'
    });
    this.apiUrl = config.apiUrl;
  }

  abstract getEntityBaseUrl(): string;

  abstract createEntity(json: any): OptEntity;

  createFilteredResponse(response: any): OptFilteredResponse {
    const entities = response.json().result.map((item: JSON) => {
      return this.createEntity(item);
    });
    return new OptFilteredResponse(response, entities);
  }

  getBaseUrl(): string {
    return this.apiUrl + '/' + this.apiVersion;
  }

  getHeaders(): Headers {
    const headers = Object.assign(this.defaultHeaders.toJSON(), {
      'Authorization': this.auth.getToken()
    });
    return new Headers(headers);
  }

  getList(): Observable<OptEntity[]> {
    return this.http
      .get(this.getEntityBaseUrl() + '?limit=1000', {headers: this.getHeaders()})
      .map(response => {
        return response.json().result.map((item: JSON) => {
          return this.createEntity(item);
        });
      })
      .catch(this.handleError);
  }

  // @example filtersOptions: FiltersOptions = {
  //   filterBy: new FilterBy('name', 'orellana', OperatorOptions.Like),
  //   select: new Select('name'),
  //   offset: new Offset(0),
  //   limit: new Limit(10),
  //   orderBy: new OrderBy('name', OrderByOptions.Desc),
  //   search: new Search('orellana'),
  //   extra: new Extra([
  //     new Filter('practitioner', 'orellana'),
  //     new Filter('from', '2017-09-15'),
  //     new Filter('to', '2017-09-18')
  //   ]),
  // };
  getFilteredList(filtersOptions: FiltersOptions): Observable<OptFilteredResponse> {
    const filterFactory = new FilterFactory(this.getEntityBaseUrl());
    const url = filterFactory.generateUrl(filtersOptions);

    return this.http.get(url, {headers: this.getHeaders()})
      .map(response => this.createFilteredResponse(response))
      .catch(this.handleError);
  }

  getOne(id: number): Observable<OptEntity> {
    const url = this.getEntityBaseUrl() + '/' + id;
    return this.http.get(url, {headers: this.getHeaders()})
      .map(response => this.createEntity(response.json().result))
      .catch(this.handleError);
  }

  remove(id: number): Observable<OptResponse> {
    const url = this.getEntityBaseUrl() + '/' + id;
    return this.http.delete(url, {headers: this.getHeaders()})
      .map(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  create(entity: OptEntity): Observable<OptResponse> {
    return this.http
      .post(this.getEntityBaseUrl(), JSON.stringify(entity.toForm()), {headers: this.getHeaders()})
      .map(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  update(entity: OptEntity): Observable<OptResponse> {
    const url = this.getEntityBaseUrl() + '/' + entity.id;
    return this.http
      .patch(url, JSON.stringify(entity.toForm()), {headers: this.getHeaders()})
      .map(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  change(entity: OptEntity): Observable<OptResponse> {
    const url = this.getEntityBaseUrl() + '/' + entity.id;
    return this.http
      .put(url, JSON.stringify(entity.toForm()), {headers: this.getHeaders()})
      .map(response => OptResponse.fromJSON(response))
      .catch(this.handleError);
  }

  protected handleError(error: Response): Observable<any> {
    console.error('An error occurred', error);
    return Observable.throw(OptResponse.fromJSON(error));
  }
}
