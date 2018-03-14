/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 * Parent abstract class for models
 */
import { isUndefined } from 'util';
import * as moment from 'moment';
var OptEntity = (function () {
    function OptEntity(jsonObject) {
        if (!jsonObject) {
            return;
        }
        this.decode(jsonObject);
    }
    /**
     * Use for generate form attribute from key instance attribute
     */
    OptEntity.prototype.getFormContentAttribute = function (key, attribute) {
        var _this = this;
        var formAttribute;
        if (key !== 'id' && !isUndefined(attribute)) {
            var attributeId = attribute && attribute.id ? attribute.id : null;
            attributeId = !attributeId && (attribute && attribute._id) ? attribute._id : attributeId;
            if (attribute instanceof OptEntity && attributeId) {
                formAttribute = attributeId;
            }
            else if (moment.isMoment(attribute)) {
                formAttribute = attribute.format();
            }
            else if (Array.isArray(attribute)) {
                if (attribute.length > 0) {
                    formAttribute = [];
                    Object.keys(attribute).map(function (subAttributeKey) {
                        var formContentAttribute = _this.getFormContentAttribute(subAttributeKey, attribute[subAttributeKey]);
                        if (!isUndefined(formContentAttribute)) {
                            formAttribute.push(formContentAttribute);
                        }
                    });
                }
            }
            else {
                formAttribute = attribute;
            }
        }
        return formAttribute;
    };
    /**
     * Get form object of the entity
     */
    OptEntity.prototype.getFormContent = function () {
        var formContent = {};
        var self = this;
        Object.keys(this).map(function (key) {
            var attribute = self[key];
            // remove underscore on private attributes
            key = key.replace(/^[_]/g, '');
            var formContentAttribute = self.getFormContentAttribute(key, attribute);
            if (!isUndefined(formContentAttribute)) {
                formContent[key] = formContentAttribute;
            }
        });
        return formContent;
    };
    /**
     * Parse instance object data to json object for api rest
     */
    OptEntity.prototype.toForm = function () {
        var form = {};
        form[this.getFormEntityName()] = this.getFormContent();
        return form;
    };
    return OptEntity;
}());
export { OptEntity };
//# sourceMappingURL=entity.model.js.map