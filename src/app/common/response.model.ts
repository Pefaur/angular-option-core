/**
 * @author Carolina Pinzon <cpinzon@option.cl>
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
export class OptResponse {
  isStatusOk: boolean;
  statusCode: number;
  message: string;
  headers: Headers;
  object: object;

  public static fromJSON(response: any): OptResponse {
    const instance = new OptResponse();
    instance.isStatusOk = response.ok;
    instance.statusCode = response.status;
    instance.headers = response.headers;
    if (response._body !== '') {
      instance.object = response.json();
    } else {
      instance.object = {};
    }
    return instance;
  }
}
