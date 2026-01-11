import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICard {
    id: string;
    title: string;
    price: number | undefined | null;
}

export abstract class Card<T extends ICard> extends Component<T> {
    protected titleCard: HTMLElement;
    protected priceCard: HTMLElement;

    constructor (container: HTMLElement) {
        super(container);

        this.titleCard = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceCard = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(text: string) {
        this.titleCard.textContent = text;
    }

    set price(value: number | undefined | null) {
        if ( value === null) {
            this.priceCard.textContent = 'Бесценно';
        } else {
            this.priceCard.textContent = `${value} синапсов`;
        }
    }
}