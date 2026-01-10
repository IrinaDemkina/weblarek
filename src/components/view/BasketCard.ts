import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Card, ICard} from "./Card";

export interface IBasketCard extends ICard {
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected indexCard: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.indexCard = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.deleteButton.addEventListener('click', () => {
            this.events.emit('basket:remove', {id: this.idCard});
        });
    }

    set index(value: number) {
        this.indexCard.textContent = String(value);
    }
}