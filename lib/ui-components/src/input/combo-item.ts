import { BaseComponent } from "../base/base-component.js";

export class ComboItem extends BaseComponent {
    constructor() {
        super();
    }

    #filter: Object | null = null;

    get filter(): Object | null {
        if (this.#filter == undefined) {
            this.#filter = this.getAttribute('filter');
        }

        return this.#filter;
    }

    get label(): string {
        const label = this.getAttribute('label');
        if (label == null) {
            return this.textContent;

        }
        
        return label;
    }
}