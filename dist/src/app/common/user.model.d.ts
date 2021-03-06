import { OptEntity } from './entity.model';
/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 */
export declare class OptUser extends OptEntity {
    fullName: string;
    username: string;
    password: string;
    email: string;
    roles: string[];
    phoneNumber: string;
    getFormEntityName(): string;
    protected decode(jsonObject: object): void;
    setFullName(firstName: string, lastName: string): void;
}
