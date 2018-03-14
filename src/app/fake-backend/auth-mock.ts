import { RequestMethod } from '@angular/http';
import { Mock } from './mock';

export class AuthMock extends Mock {
  users: any[] = AuthMock.getUsers();

  static getUsers(): any[] {
    const localStorageUsers = localStorage.getItem('users');
    let users = localStorageUsers ? JSON.parse(localStorageUsers) : [];
    if (users.length === 0) {
      const avatar = 'http://via.placeholder.com/160x160/F1F1F2';
      users = [{
        'id': 1,
        'authorizationSimpleToken': '1',
        'firstName': 'Francisco',
        'lastName': 'Rodríguez',
        'secondLastName': 'Fernández',
        'phone': '+56293214008',
        'cellPhone': '+56993214008',
        'email': 'frodriguez@option.cl',
        'bornDate': null,
        'sex': null,
        'healthCare': null,
        'password': 'a12345678',
        'avatar': avatar
      }];
      localStorage.setItem('users', JSON.stringify(users));
    }
    return users;
  }

  static getUserByAuthorizationSimpleToken(token: string): object {
    const filteredUsers = AuthMock.getUsers().filter(user => {
      return user.authorizationSimpleToken === token;
    });
    return filteredUsers[0];
  }

  requests(): boolean {
    // array in local storage for registered users
    const localStorageUsers = localStorage.getItem('users');
    const users = localStorageUsers ? JSON.parse(localStorageUsers) : [];

    // authenticate
    if (this.connection.request.url.endsWith('/login') && this.connection.request.method === RequestMethod.Post) {
      // get parameters from post request
      const params = JSON.parse(this.connection.request.getBody());
      const credentials = params.credentials;

      const authorizationBody = this.login(credentials.username, credentials.password);
      if (authorizationBody) {
        this.mockRespond({
          status: 200,
          body: authorizationBody
        });
      } else {
        // // else return 400 bad request
        this.mockError({
          status: 401,
          statusText: 'Username or password is incorrect'
        });
      }

      return true;
    }

    if (this.connection.request.url.endsWith('/register') && this.connection.request.method === RequestMethod.Post) {
      // get object from post body
      const requestBody = JSON.parse(this.connection.request.getBody());
      // get form data
      const newUser = requestBody[Object.keys(requestBody)[0]];

      // validation
      const duplicateUser = users.filter((user: any) => {
        return user.email === newUser.email;
      }).length;
      if (duplicateUser) {
        this.mockError({
          status: 400,
          statusText: 'Username ' + newUser.username + ' is already taken'
        });
        return true;
      }

      // save new user
      newUser.id = users.length + 1;
      const body = this.createAuthorizationBody(newUser);
      newUser.authorizationSimpleToken = body.authorization.simpleToken;
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // respond 200 OK
      this.mockRespond({status: 200, body: body});

      return true;
    }

    if (this.connection.request.url.endsWith('/reset/send-email') && this.connection.request.method === RequestMethod.Post) {
      // get object from post body
      const requestBody = JSON.parse(this.connection.request.getBody());

      // respond 200 OK
      this.mockRespond({status: 200, body: {}});

      return true;
    }

    const getOneRegex = new RegExp('reset-password/' + '.*$');
    if (this.connection.request.url.match(getOneRegex) && this.connection.request.method === RequestMethod.Post) {
      // get object from post body
      const requestBody = JSON.parse(this.connection.request.getBody());

      // respond 200 OK
      this.mockRespond({status: 200, body: {}});

      return true;
    }

    return false;
  }

  login(username: string, password: string): object | undefined {
    // find if any user matches login credentials
    const filteredUsers = this.users.filter(user => {
      return user.username === username && user.password === password;
    });
    if (filteredUsers.length) {
      // if login details are valid return 200 OK with user details and fake jwt token
      const user = filteredUsers[0];
      return this.createAuthorizationBody(user);
    }
  }

  createAuthorizationBody(user: any): any {
    const simpleToken = user.id + '';
    return {
      authorization: {
        simpleToken: simpleToken
      }
    };
  }
}
