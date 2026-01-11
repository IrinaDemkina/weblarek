import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IForm {
    valid: boolean;
    errors: string;
}

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

    this.submitButton = ensureElement<HTMLButtonElement> ('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement> ('.form__errors', this.container);

    this.container.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        this.events.emit(`${this.container.name}:submit`);
    });

    this.container.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const field = target.name as keyof T;
        const value = target.value;
        this.onInputChange(field, value);
    });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`form:change`, {field, value});
    }

    set error(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
        }
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}