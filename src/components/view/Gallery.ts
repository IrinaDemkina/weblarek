import { Component } from '../base/Component';

interface IGallery {
    list: HTMLElement[];
}
export class Gallery extends Component<IGallery> {

    constructor(container: HTMLElement) {
        super(container);
    }

    set list(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}