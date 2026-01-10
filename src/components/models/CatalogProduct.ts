import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogProduct {
    private product: IProduct[];
    private selectedProduct: IProduct | undefined;
    private events: IEvents;

    constructor(events: IEvents, product: IProduct[] = []) {
        this.product = product;
        this.selectedProduct = undefined;
        this.events = events;
    }

    saveProducts(product: IProduct[]): void {
        this.product = product;
        this.events.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.product;
    }

    getProductId(id: string): IProduct | undefined {
        return this.product.find(product => product.id === id) || undefined;
    }

    saveSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('product:changed', { product });
    }

    getSelectedProduct(): IProduct | undefined {
        return this.selectedProduct;
    }
}
