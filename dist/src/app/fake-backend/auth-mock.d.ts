import { Mock } from './mock';
export declare class AuthMock extends Mock {
    users: any[];
    static getUsers(): any[];
    static getUserByAuthorizationSimpleToken(token: string): object;
    requests(): boolean;
    login(username: string, password: string): object | undefined;
    createAuthorizationBody(user: any): any;
}
