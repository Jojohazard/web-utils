import { Decoration } from "styling/build/text/decoration.js";
import { BaseComponent } from "../base/base-component.js";
import { TextFormater } from "styling";

export class TextEditorPanel extends BaseComponent {
    constructor() {
        super({
            fallbackChildren: [
                { tagName: 'button', classes: ['tep__bold'] },
                { tagName: 'button', classes: ['tep__cursive'] },
                { tagName: 'button', classes: ['tep__underline'] },
                { tagName: 'button', classes: ['tep__center'] },
                { tagName: 'button', classes: ['tep__justify'] },
                { tagName: 'button', classes: ['tep__left'] },
                { tagName: 'button', classes: ['tep__right'] }
            ]
        });

        this.#boundClickHandler = this.#handleClick.bind(this);
    }

    #bold: HTMLElement | undefined;
    #cursive: HTMLElement | undefined;
    #underline: HTMLElement | undefined;
    #center: HTMLElement | undefined;
    #justify: HTMLElement | undefined;
    #left: HTMLElement | undefined;
    #right: HTMLElement | undefined;
    #textFormater: TextFormater | undefined;
    #boundClickHandler: (e: Event) => void;

    get bold(): HTMLElement {
        if (this.#bold == undefined) {
            this.#bold = this.querySelector('.tep__bold') as HTMLElement;
        }

        return this.#bold;
    }

    get cursive(): HTMLElement {
        if (this.#cursive == undefined) {
            this.#cursive = this.querySelector('.tep__cursive') as HTMLElement;
        }
        return this.#cursive;
    }

    get underline(): HTMLElement {
        if (this.#underline == undefined) {
            this.#underline = this.querySelector('.tep__underline') as HTMLElement;
        }
        return this.#underline;
    }

    get center(): HTMLElement {
        if (this.#center == undefined) {
            this.#center = this.querySelector('.tep__center') as HTMLElement;
        }
        return this.#center;
    }

    get justify(): HTMLElement {
        if (this.#justify == undefined) {
            this.#justify = this.querySelector('.tep__justify') as HTMLElement;
        }
        return this.#justify;
    }

    get left(): HTMLElement {
        if (this.#left == undefined) {
            this.#left = this.querySelector('.tep__left') as HTMLElement;
        }
        return this.#left;
    }

    get right(): HTMLElement {
        if (this.#right == undefined) {
            this.#right = this.querySelector('.tep__right') as HTMLElement;
        }
        return this.#right;
    }

    set textFormater(textFormater: TextFormater) {
        this.#textFormater = textFormater;
    }

    protected async _init(): Promise<void> {
        await super._init();

        this.addEventListener('click', this.#boundClickHandler);
    }

    #handleClick(e: Event): void {
        console.log(e, this.bold);
        const selection: Selection | null = window.getSelection();
        if (selection == null) return;

        console.log(selection);

        const ranges = TextFormater.getSelectionRanges(selection);

        console.log(ranges);

        if (e.target === this.bold) {
            this.#textFormater?.toggle(ranges, Decoration.Bold);
        }
        else if (e.target === this.cursive) {
            this.#textFormater?.toggle(ranges, Decoration.Cursive);
        }
        else if (e.target === this.underline) {
            this.#textFormater?.toggle(ranges, Decoration.Underline);
        }
    }
}