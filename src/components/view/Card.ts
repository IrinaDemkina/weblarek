import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface ICard {
    id: string;
    title: string;
    price: number | undefined | null;
}

export abstract class Card<T extends ICard> extends Component<T> {
    protected titleCard: HTMLElement;
    protected priceCard: HTMLElement;
    protected idCard: string = '';

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);

        this.titleCard = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceCard = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set id(text: string) {
        this.idCard = text;
        this.container.dataset.id = text;
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