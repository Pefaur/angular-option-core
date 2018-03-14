/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 * Parent abstract class for models
 */
var OptEntity = (function () {
    function OptEntity(jsonObject) {
        if (!jsonObject) {
            return;
        }
        this.decode(jsonObject);
    }
    /**
     * Get form object of the entity
     */
    OptEntity.prototype.getFormContent = function () {
        var formContent = {};
        var self = this;
        Object.keys(this).map(function (key) {
            var attribute = self[key];
            if (key !== 'id') {
                if (attribute instanceof OptEntity && attribute.id) {
                    formContent[key] = attribute.id;
                }
                else if (Array.isArray(attribute)) {
                    if (attribute.length > 0) {
                        formContent[key] = [];
                        attribute.map(function (subAttribute) {
                            formContent[key].push(subAttribute.getFormContent());
                        });
                    }
                }
                else {
                    formContent[key] = attribute;
                }
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