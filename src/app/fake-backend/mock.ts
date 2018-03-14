import { Response, ResponseOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

export class MockError extends Response implements Error {
  name: any;
  message: any;

  constructor(responseOptions: object) {
    super(new ResponseOptions(responseOptions));
  }
}

export abstract class Mock {
  constructor(protected connection: MockConnection) {
  }

  abstract requests(): boolean;

  mockRespond(responseOptions: object): void {
    this.connection.mockRespond(new Response(new ResponseOptions(responseOptions)));
  }

  mockError(responseOptions: object): void {
    this.connection.mockError(new MockError(responseOptions));
  }
}
