/**
 * @author Carolina Pinzon <cpinzon@option.cl>
 * @author Daniel Caris Zapata <dcaris@option.cl>
 */
export declare class OptResponse {
    isStatusOk: boolean;
    statusCode: number;
    message: string;
    headers: Headers;
    object: object;
    static fromJSON(response: any): OptResponse;
}
