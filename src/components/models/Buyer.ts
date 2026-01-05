import { IBuyer, TPayment, IBuyerErrors} from "../../types";



export class Buyer {
    private payment: TPayment;
    private email: string;
    private phone: string;
    private address: string;

    constructor(data?: Partial<IBuyer>) {
    this.payment = data?.payment ?? undefined;
    this.email = data?.email ?? '';
    this.phone = data?.phone ?? '';
    this.address = data?.address ?? '';
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
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
}