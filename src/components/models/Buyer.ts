import { IBuyer, TPayment, IBuyerErrors} from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
    private payment: TPayment = undefined;
    private email: string = '';
    private phone: string = '';
    private address: string = '';
    private events: IEvents;

    constructor(events: IEvents) {
      this.events = events;
    }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.emit()
  }

  setEmail(email: string): void {
    this.email = email;
    this.emit()
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.emit()
  }

  setAddress(address: string): void {
    this.address = address;
    this.emit()
  }

  getData(): IBuyer {
    return {
    payment: this.payment,
    email: this.email,
    phone: this.phone,
    address: this.address
    };
  }

  clearData(): void {
    this.payment = undefined;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit()
  }

  validate(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (this.payment === undefined) {
        errors.payment = 'Не выбран вид оплаты';
    }

    if(!this.email.trim()) {
        errors.email = 'Укажите емэйл';
    }

    if(!this.phone.trim()) {
        errors.phone = 'Укажите телефон';
    }

    if(!this.address.trim()) {
        errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }

  isValid(): boolean {
    return Object.keys(this.validate()).length === 0;
  }

  validateOrderForm(): Partial<IBuyerErrors>{
    const errors: Partial<IBuyerErrors> = {};
    if (this.payment === undefined) {
        errors.payment = 'Не выбран вид оплаты';
    }
    if(!this.address.trim()) {
        errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }

  validateContactsForm(): Partial<IBuyerErrors>{
    const errors: Partial<IBuyerErrors> = {};
    if(!this.email.trim()) {
        errors.email = 'Укажите почту';
    }

    if(!this.phone.trim()) {
        errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  protected emit():void {
    const errors = this.validate();
    this.events.emit('formErrors:change', errors);
    if (Object.keys(errors).length === 0) {
        this.events.emit('buyer:ready');
    }
  }
}