import type { ObjectValueFactory } from 'binding';
import { ObjectValueInputComponent } from './object-value-input-component.js';
import type { BaseComponentOptions } from '../base/base-component-options.js';
import { prepareStylesheets } from '../base/base-helpers.js';
import { ComboItem } from './combo-item.js';

// @ts-ignore
import styles from "../../styles/input/combo-box.css?raw";

export class ComboBox extends ObjectValueInputComponent {
    constructor(
        factory?: ObjectValueFactory,
        options: BaseComponentOptions = {}
    ) {
        options.fallbackChildren = [
            { tagName: 'div', classes: ['cb__input'], attributes: { contentEditable: 'true' } },
            { tagName: 'div', classes: ['cb__items'] }
        ];
        options.hasShadowRoot = true;
        options.shadowRootInit = {
            mode: 'open',
            delegatesFocus: true
        };

        super(factory, options);

        this.#boundInputInputHandler = this.#handleInputInput.bind(this);
        this.#boundItemsClickHandler = this.#handleItemsClick.bind(this);
        this.#boundInputFocusHandler = this.#handleInputFocus.bind(this);
        this.#boundInputBlurHandler = this.#handleInputBlur.bind(this);
        this.#boundKeyDownHandler = this.#handleKeyDown.bind(this);
    }

    #input: HTMLDivElement | undefined;
    #items: HTMLDivElement | undefined;
    #selectedItem: ComboItem | undefined;
    #boundInputInputHandler: (e: InputEvent) => void;
    #boundItemsClickHandler: (e: Event) => void;
    #boundInputFocusHandler: () => void;
    #boundInputBlurHandler: () => void;
    #boundKeyDownHandler: (e: KeyboardEvent) => void;

    get input(): HTMLDivElement {
        if (this.#input == undefined) {
            const input = this.queryShadow('.cb__input');
            if (input === null) throw new Error('missing cb__input');
            this.#input = input as HTMLDivElement;
        }

        return this.#input;
    }

    get items(): HTMLDivElement {
        if (this.#items == undefined) {
            const items = this.queryShadow('.cb__items');
            if (items === null) throw new Error('missing cb__items');
            this.#items = items as HTMLDivElement;
        }

        return this.#items;
    }

    #setSelectedItem(item: ComboItem) {
        if (this.factory != undefined) {
            this.value = this.factory.extractObject(item);
        } else {
            this.value = item.label;
        }
        this.#selectedItem = item;
        this.input.textContent = item.label;
        this.blur();
        this.dispatchEvent(new Event('change'));
    }

    #handleInputInput(e: InputEvent) {
        this.#updateUI();

        const visibleItems = Array.from(this.items.children).filter(
            item => {
                if (item instanceof ComboItem) {
                    return !item.hasState('hidden');
                }
            });

        if (
            e.inputType === 'deleteContentBackward' ||
            e.inputType === 'deleteContentForward'
        ) {
            return;
        }
        else if (visibleItems.length === 1) this.#setSelectedItem(visibleItems[0] as ComboItem);
    }

    #handleItemsClick(e: Event) {
        if (!(e.target instanceof ComboItem)) return;
        this.#setSelectedItem(e.target);
        this.#updateUI();
    }

    #handleInputFocus(): void {
        this.deleteState('hidden');
    }

    #handleInputBlur(): void {
        this.addState('hidden');

        if (this.#selectedItem != undefined) {
            this.input.textContent = this.#selectedItem.label;
            this.#updateUI();
        }
    }

    #handleKeyDown(e: KeyboardEvent): void {
        const selected = this.items.querySelector('wu-combo-item.selected') as ComboItem;

        const children = Array.from(this.items.children)
            .filter(item => {
                if (item instanceof ComboItem) {
                    return !item.hasState('hidden');
                }
                return false;
            }) as ComboItem[];

        if (children.length === 0) return;

        let currentIndex = selected && children.includes(selected)
            ? children.indexOf(selected)
            : 0;

        let nextItem: ComboItem | undefined = undefined;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!this.hasState('hidden') && selected) {
                    this.#setSelectedItem(selected);
                }
                this.#updateUI();
                return;

            case 'ArrowDown':
                if (selected == undefined) {
                    nextItem = children[0];
                } else {
                    nextItem = children[(currentIndex + 1) % children.length];
                }
                break;

            case 'ArrowUp':
                if (selected == undefined) {
                    nextItem = children[children.length - 1];
                } else {
                    nextItem = children[(currentIndex - 1 + children.length) % children.length];
                }
                break;

            default:
                return;
        }

        if (selected != undefined) {
            selected.classList.remove('selected');
            selected.deleteState('selected');
        }

        nextItem?.classList.add('selected');
        nextItem?.addState('selected');
    }

    #updateUI(): void {
        for (const item of this.items.children) {
            if (!(item instanceof ComboItem)) {
                continue;
            }
            else if (item.label.trim().toLowerCase().startsWith(this.input.textContent.trim().toLowerCase())) {
                item.deleteState('hidden');
            }
            else {
                item.addState('hidden');
            }
        }
    }

    protected async _init(): Promise<void> {
        await super._init();

        this.addState('hidden');

        this.input.addEventListener('focus', this.#boundInputFocusHandler);
        this.input.addEventListener('blur', this.#boundInputBlurHandler);
        this.input.addEventListener('input', this.#boundInputInputHandler as EventListener);
        this.items.addEventListener('click', this.#boundItemsClickHandler);
        this.addEventListener('keydown', this.#boundKeyDownHandler);
    }

    static define(tag: string): void {
        ComboBox.stylesheets = prepareStylesheets(styles);
        super.define(tag);
        ComboItem.define('wu-combo-item');
    }

    addItems(...items: Array<{ label: string, filter?: string | undefined, attributes: Record<string, string> }>): void {
        for (const item of items) {
            const docItem = document.createElement('wu-combo-item');
            docItem.setAttribute('label', item.label);
            docItem.textContent = item.label;
            if (item.filter != undefined) docItem.setAttribute('filter', item.filter);
            for (const [key, value] of Object.entries(item.attributes)) {
                docItem.setAttribute(key, value);
            }
            this.items.appendChild(docItem);
        }
    }
}