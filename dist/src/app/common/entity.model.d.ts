/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 * Parent abstract class for models
 */
export declare abstract class OptEntity {
    id: number;
    constructor(jsonObject?: object);
    /**
     * get entity name for form key
     */
    abstract getFormEntityName(): string;
    /**
     * Decode json to class attributes
     */
    protected abstract decode(jsonObject: object): void;
    /**
     * Get form object of the entity
     */
    getFormContent(): object;
    /**
     * Parse instance object data to json object for api rest
     */
    toForm(): object;
}
