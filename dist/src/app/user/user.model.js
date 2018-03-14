var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { OptEntity } from '../common/entity.model';
/**
 * @author Daniel Caris Zapata <dcaris@optionti.com>
 */
var OptUser = (function (_super) {
    __extends(OptUser, _super);
    function OptUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptUser.prototype.getFormEntityName = function () {
        return 'user';
    };
    OptUser.prototype.decode = function (jsonObject) {
        this.id = jsonObject['id'];
        this.fullName = jsonObject['fullName'];
        this.username = jsonObject['username'];
        this.password = jsonObject['password'];
        this.email = jsonObject['email'];
        this.roles = jsonObject['roles'];
        this.phoneNumber = jsonObject['phoneNumber'];
    };
    OptUser.prototype.setFullName = function (firstName, lastName) {
        this.fullName = firstName + ' ' + lastName;
    };
    return OptUser;
}(OptEntity));
export { OptUser };
//# sourceMappingURL=user.model.js.map