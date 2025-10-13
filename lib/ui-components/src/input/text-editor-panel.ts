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
    }

    #bold: HTMLElement | undefined;
    #cursive: HTMLElement | undefined;
    #underline: HTMLElement | undefined;
    #center: HTMLElement | undefined;
    #justify: HTMLElement | undefined;
    #left: HTMLElement | undefined;
    #right: HTMLElement | undefined;
    #textFormater: TextFormater | undefined;

    set textFormater(textFormater: TextFormater) {
        this.#textFormater = textFormater;
    }

    protected async _init(): Promise<void> {
        await super._init();
    }
}