import { OptEntity } from './entity.model';
import { FilterFactory, FiltersOptions, Total } from './filter';

/**
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
export class OptFilteredResponse {
  filtersOptions: FiltersOptions;
  data: OptEntity[];

  constructor(response: any, data: OptEntity[]) {
    this.data = data;
    this.filtersOptions = FilterFactory.getFiltersByUrl(response.url);
    this.filtersOptions.total = new Total(Number.parseInt(response.json().total));
  }
}
