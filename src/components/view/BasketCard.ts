import { ensureElement } from "../../utils/utils";
import { Card, ICard} from "./Card";

export interface IBasketCard extends ICard {
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected indexCard: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        this.indexCard = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.deleteButton.addEventListener('click', onClick);
    }

    set index(value: number) {
        this.indexCard.textContent = String(value);
    }
}