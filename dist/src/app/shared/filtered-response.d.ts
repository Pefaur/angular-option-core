import { OptEntity } from './entity.model';
import { FiltersOptions } from './filter';
/**
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
export declare class OptFilteredResponse {
    filtersOptions: FiltersOptions;
    data: OptEntity[];
    constructor(response: any, data: OptEntity[]);
}
