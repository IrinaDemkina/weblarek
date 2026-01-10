import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, private readonly events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.button.addEventListener('click', () => {
            this.events.emit('basket:checkout')
        });
    }

    set items(items: HTMLElement[]) {
        if(items.length > 0){
        this.listElement.replaceChildren(...items);
        this.button.disabled = false;
        } else {
            this.listElement.replaceChildren();
            this.listElement.textContent = '';
            this.button.disabled = true;
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}