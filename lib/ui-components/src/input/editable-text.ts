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

        this.#boundKeyDownHandler = this.#handleKeyDown.bind(this);
    }

    #text: HTMLElement | undefined;
    #textEditorPanel: TextEditorPanel | undefined;
    #boundKeyDownHandler: (e: KeyboardEvent) => void;

    get text(): HTMLElement {
        if (this.#text == undefined) {
            const text = this.querySelector('.et__text') as HTMLElement;
            if (text == null) throw new Error('.et__text is missing within editable text');
            this.#text = text;
        }

        return this.#text;
    }

    get textEditorPanel(): TextEditorPanel {
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
        this.addEventListener('keydown', this.#boundKeyDownHandler);
    }

    static define(tagName: string): void {
        super.define(tagName);
        TextEditorPanel.define('wu-text-editor-panel');
    }

    #handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }
}