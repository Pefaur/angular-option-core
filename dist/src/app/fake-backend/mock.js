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
import { Response, ResponseOptions } from '@angular/http';
var MockError = (function (_super) {
    __extends(MockError, _super);
    function MockError(responseOptions) {
        return _super.call(this, new ResponseOptions(responseOptions)) || this;
    }
    return MockError;
}(Response));
export { MockError };
var Mock = (function () {
    function Mock(connection) {
        this.connection = connection;
    }
    Mock.prototype.mockRespond = function (responseOptions) {
        this.connection.mockRespond(new Response(new ResponseOptions(responseOptions)));
    };
    Mock.prototype.mockError = function (responseOptions) {
        this.connection.mockError(new MockError(responseOptions));
    };
    return Mock;
}());
export { Mock };
//# sourceMappingURL=mock.js.map