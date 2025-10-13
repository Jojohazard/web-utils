import { TextFormater } from "styling";
import { InputComponent } from "./input-component.js";
import { TextEditorPanel } from "./text-editor-panel.js";

export class EditableText extends InputComponent {
    constructor() {
        super({
            fallbackChildren: [
                { tagName: 'wu-text-editor-panel' }
            ]
        });
    }

    #text: HTMLElement | undefined;
    #textEditorPanel: TextEditorPanel | undefined;

    get text(): HTMLElement {
        if (this.#text == undefined) {
            const text = this.querySelector('.et__text') as HTMLElement;
            if (text == null) throw new Error('.et__text is missing within editable text');
            this.#text = text;
        }

        return this.#text;
    }

    get textEditorPanel() {
        if (this.#textEditorPanel == undefined) {
            const textEditorPanel = this.querySelector('wu-text-editor-panel') as TextEditorPanel;
            if (textEditorPanel == null) throw new Error('wu-text-editor-panel missing');
            this.#textEditorPanel = textEditorPanel;
        }

        return this.#textEditorPanel;
    }

    protected async _init(): Promise<void> {
        if (!this.text.getAttribute('contentEditable') || this.text.getAttribute('contentEditable') == 'false') {
            this.text.setAttribute('contentEditable', 'true');
        }

        await super._init();

        this.textEditorPanel.textFormater = new TextFormater(this.text);
    }

    static define(tagName: string) {
        super.define(tagName);
        TextEditorPanel.define('wu-text-editor-panel');
    }
}