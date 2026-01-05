import { IProduct } from "../../types";

export class CatalogProduct {
    private product: IProduct[];
    private selectedProduct: IProduct | undefined;

    constructor(product: IProduct[] = []) {
        this.product = product;
        this.selectedProduct = undefined;
    }

    saveProducts(product: IProduct[]): void {
        this.product = product;
    }

    getProducts(): IProduct[] {
        return this.product;
    }

    getProductId(id: string): IProduct | undefined {
        return this.product.find(product => product.id === id) || undefined;
    }

    saveSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | undefined {
        return this.selectedProduct;
    }
}
