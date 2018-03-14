/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 * Parent abstract class for models
 */
import { isUndefined } from 'util';
import * as moment from 'moment';

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
   * Use for generate form attribute from key instance attribute
   */
  getFormContentAttribute(key: any, attribute: any) {
    let formAttribute: any;
    if (key !== 'id' && !isUndefined(attribute)) {
      let attributeId = attribute && attribute.id ? attribute.id : null;
      attributeId = !attributeId && (attribute && attribute._id) ? attribute._id : attributeId;
      if (attribute instanceof OptEntity && attributeId) {
        formAttribute = attributeId;
      } else if (moment.isMoment(attribute)) {
        formAttribute = attribute.format();
      } else if (Array.isArray(attribute)) {
        if (attribute.length > 0) {
          formAttribute = [];
          Object.keys(attribute).map(subAttributeKey => {
            const formContentAttribute = this.getFormContentAttribute(subAttributeKey, (<any>attribute)[subAttributeKey]);
            if (!isUndefined(formContentAttribute)) {
              formAttribute.push(formContentAttribute);
            }
          });
        }
      } else {
        formAttribute = attribute;
      }
    }
    return formAttribute;
  }

  /**
   * Get form object of the entity
   */
  public getFormContent(): object {
    const formContent = {};
    const self = this;

    Object.keys(this).map((key: any) => {
      const attribute = (<any>self)[key];
      // remove underscore on private attributes
      key = key.replace(/^[_]/g, '');
      const formContentAttribute = self.getFormContentAttribute(key, attribute);
      if (!isUndefined(formContentAttribute)) {
        (<any>formContent)[key] = formContentAttribute;
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
