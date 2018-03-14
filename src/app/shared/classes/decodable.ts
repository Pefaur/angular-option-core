/**
 * @author Daniel Caris Zapata <dcaris@option.cl>
 * @description Interface for instance attributes with json object decode
 */
export interface Decodable {

  /**
   * Decode json to class attributes
   */
  decode(jsonObject: object): void;
}
