import { IEvents } from '../base/Events';
import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

export interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this. buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this. buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.buttonCard.addEventListener('click', () => {
            this.setPaymentMethod('card');
            this.onInputChange('payment', 'card');
        });

        this.buttonCash.addEventListener('click', () => {
            this.setPaymentMethod('cash');
            this.onInputChange('payment', 'cash');
        });

    }
    
    protected setPaymentMethod(method: 'card'| 'cash') {
        if (method === 'card') {
            this.buttonCard.classList.add('button_alt-active');
            this.buttonCash.classList.remove('button_alt-active');
        } else {
            this.buttonCard.classList.remove('button_alt-active');
            this.buttonCash.classList.add('button_alt-active');
        

        }
    }

    set payment(value: TPayment) {
        if (value) {
            this.setPaymentMethod(value);
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}