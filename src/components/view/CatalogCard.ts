import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { Card, ICard } from "./Card";

export interface ICatalogCard extends ICard {
    image: string;
    category: string;
}

export class CatalogCard  extends Card<ICatalogCard> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events)

        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);

        this.container.addEventListener( 'click', () => {
            this.events.emit('card:select', {id: this.idCard});
        });
    }

    set image(value: string) {
        this.imageCard.src = `${CDN_URL}/${value}`;
        this.imageCard.alt = this.title;
   }

   set category(value: string) {
        this.categoryCard.textContent = value;
        Object.values(categoryMap).forEach(className => this.categoryCard.classList.remove(className));
        if (value in categoryMap) {
            this.categoryCard.classList.add(categoryMap[value as keyof typeof categoryMap]);
        }
    }

}
