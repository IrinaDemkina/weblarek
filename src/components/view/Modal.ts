import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected cntentInModal: HTMLElement;
    
    constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close',this.container);
    this.cntentInModal = ensureElement<HTMLElement>('.modal__content',this.container);

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('mousedown', (event: MouseEvent) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  protected handleEscUp(evt: KeyboardEvent): void {
        if (evt.key === 'Escape') {
            this.close();
        }
  }

  set content(value: HTMLElement) {
        this.cntentInModal.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keyup', this.handleEscUp);
        this.cntentInModal.replaceChildren();
        this.events.emit('modal:close');
    }
}