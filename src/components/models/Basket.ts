import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private events:IEvents;
  private items: IProduct[];

  constructor(items: IProduct[] = [], events: IEvents) {
    this.items = items;
    this.events = events;

  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
      this.events.emit('basket:changed');
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}