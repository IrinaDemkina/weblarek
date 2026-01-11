import { ensureElement } from "../../utils/utils";
import { ICatalogCard } from "./CatalogCard";
import { Card} from "./Card";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface IPreviewCard extends ICatalogCard {
    description: string;
    buttonActive: boolean;
    buttonText: string;
}

export class PreviewCard extends Card<IPreviewCard> {
    protected imageCard: HTMLImageElement;
    protected categoryCard: HTMLElement;
    protected descriptionCard: HTMLElement;
    protected buttonCard: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionCard = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonCard = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonCard.addEventListener('click', onClick);
    }

    set image(value: string) {
        this.imageCard.src = `${CDN_URL}/${value}`;
        this.imageCard.alt = this.title;
   }

    set category(value: string) {
        this.categoryCard.textContent = value;
        Object.values(categoryMap).forEach(className => this.categoryCard.classList.remove(className));
        if (value in categoryMap) {
            this.categoryCard.classList.add(categoryMap[value as keyof typeof categoryMap]);
        }
    }

    set description(value: string) {
        this.descriptionCard.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonCard.textContent = value;
    }

    set buttonActive(value: boolean) {
        this.buttonCard.disabled = !value 
    }

   
}
