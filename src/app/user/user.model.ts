import { OptEntity } from '../common/entity.model';

/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 */
export class OptUser extends OptEntity {

  fullName: string;
  username: string;
  password: string;
  email: string;
  roles: string[];
  phoneNumber: string;

  getFormEntityName(): string {
    return 'user';
  }

  protected decode(jsonObject: object): void {
    this.id = (<any>jsonObject)['id'];
    this.fullName = (<any>jsonObject)['fullName'];
    this.username = (<any>jsonObject)['username'];
    this.password = (<any>jsonObject)['password'];
    this.email = (<any>jsonObject)['email'];
    this.roles = (<any>jsonObject)['roles'];
    this.phoneNumber = (<any>jsonObject)['phoneNumber'];
  }

  setFullName(firstName: string, lastName: string) {
    this.fullName = firstName + ' ' + lastName;
  }
}
