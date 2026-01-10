import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { ICatalogCard } from "./CatalogCard";
import { Card} from "./Card";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface IPreviewCard extends ICatalogCard {
    description: string;
    inBasket?: boolean;
}

export class PreviewCard extends Card<IPreviewCard> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;
    protected descriptionCard: HTMLElement;
    protected buttonCard: HTMLButtonElement;
    protected priceCd: null | number |undefined;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionCard = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonCard = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.buttonCard.addEventListener('click', () => {
        this.events.emit('preview:action', {id: this.idCard});
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

    set description(value: string) {
        this.descriptionCard.textContent = value;
    }

    set price(value: number | null | undefined) {
        this.priceCd = value;
        super.price = value;
    
        if (value === null || value === undefined) {
            this.buttonCard.disabled = true;
            this.buttonCard.textContent = 'Недоступно';
        } else {
            this.buttonCard.disabled = false;
        }
    }

    set inBasket(value: boolean) {
        if (this.priceCd === null || this.priceCd === undefined) {
            this.buttonCard.disabled = true;
            this.buttonCard.textContent = 'Недоступно';
            return;
        }
        
        if (value) {
            this.buttonCard.textContent = 'Удалить из корзины';
        } else {
            this.buttonCard.textContent = 'В корзину';
        }
    }
}
