/**
 * @author Carolina Pinzon <cpinzon@option.cl>
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
var OptResponse = (function () {
    function OptResponse() {
    }
    OptResponse.fromJSON = function (response) {
        var instance = new OptResponse();
        instance.isStatusOk = response.ok;
        instance.statusCode = response.status;
        instance.headers = response.headers;
        if (response._body !== '') {
            instance.object = response.json();
        }
        else {
            instance.object = {};
        }
        return instance;
    };
    return OptResponse;
}());
export { OptResponse };
//# sourceMappingURL=response.model.js.map