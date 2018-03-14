/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 * Parent abstract class for models
 */
export abstract class OptEntity {
  id: number;

  constructor(jsonObject?: object) {
    if (!jsonObject) {
      return;
    }
    this.decode(jsonObject);
  }

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
  public getFormContent(): object {
    const formContent = {};
    const self = this;
    Object.keys(this).map(function(key: any) {
      const attribute = (<any>self)[key];
      if (key !== 'id') {
        if (attribute instanceof OptEntity && attribute.id) {
          (<any>formContent)[key] = attribute.id;
        } else if (Array.isArray(attribute)) {
          if (attribute.length > 0) {
            (<any>formContent)[key] = [];
            attribute.map(function(subAttribute: OptEntity) {
              (<any>formContent)[key].push(subAttribute.getFormContent());
            });
          }
        } else {
          (<any>formContent)[key] = attribute;
        }
      }
    });
    return formContent;
  }

  /**
   * Parse instance object data to json object for api rest
   */
  public toForm(): object {
    const form = {};
    (<any>form)[this.getFormEntityName()] = this.getFormContent();
    return form;
  }
}
