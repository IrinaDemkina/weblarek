import { IApi, IOrder, IProductList, IOrderResult } from "../types";

export class WebLarekApi{
    private api: IApi;

    constructor (api: IApi){
        this.api = api;
    }

    getProductList(): Promise<IProductList> {
    return this.api.get('/product/').then((data) => data as IProductList);
  }

    createOrder (order: IOrder): Promise<IOrderResult> {
        return this.api.post('/order/', order).then((data) => data as IOrderResult);
    }
}