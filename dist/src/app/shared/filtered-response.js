import { FilterFactory, Total } from './filter';
/**
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
var OptFilteredResponse = (function () {
    function OptFilteredResponse(response, data) {
        this.data = data;
        this.filtersOptions = FilterFactory.getFiltersByUrl(response.url);
        this.filtersOptions.total = new Total(Number.parseInt(response.json().total));
    }
    return OptFilteredResponse;
}());
export { OptFilteredResponse };
//# sourceMappingURL=filtered-response.js.map