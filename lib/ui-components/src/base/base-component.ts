import type { BaseComponentOptions } from "./base-component-options.js";
import { createFallbackChild, getFallbackChildSelector, prepareStylesheets } from "./base-helpers.js";

export class BaseComponent extends HTMLElement {
    constructor(
        options?: BaseComponentOptions
    ) {
        super();

        const defaultOptions: BaseComponentOptions = {
            debug: true,
            hasShadowRoot: false
        };

        this._options = {
            ...defaultOptions,
            ...options
        };

        this.#internals = this.attachInternals();
    }

    #internals: ElementInternals;
    #shadowRoot: ShadowRoot | undefined;

    protected _options: BaseComponentOptions;
    protected static _stylesheets: CSSStyleSheet[] = [];
    protected static _observedAttributes: string[] = [];

    protected static get _cls() {
        return this as typeof BaseComponent;
    }

    static get stylesheets(): CSSStyleSheet[] {
        return this._cls._stylesheets;
    }

    static set stylesheets(stylesheets: CSSStyleSheet[]) {
        this._cls._stylesheets = stylesheets;
    }

    static get observedAttributes(): string[] {
        return this._cls._observedAttributes;
    }

    static set observedAttributes(observedAttributes: string[]) {
        this._cls._observedAttributes = observedAttributes;
    }

    addState(state: string): void {
        if (this.hasState(state)) return;
        this.#internals.states.add(state);
    }

    deleteState(state: string): void {
        if (!this.hasState(state)) return;
        this.#internals.states.delete(state);
    }

    toggleState(state: string): void {
        if (this.hasState(state)) {
            this.deleteState(state);
            return;
        }
        this.addState(state);
    }

    hasState(state: string): boolean {
        return this.#internals.states.has(state);
    }

    protected static _append(elements: Array<Node> | Node, target: HTMLElement | DocumentFragment) {
        elements = Array.isArray(elements) ? elements : [elements];

        target.append(...elements);

        return new Promise(resolve =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
        );
    }

    protected static _prepend(elements: Array<Node> | Node, target: HTMLElement | DocumentFragment) {
        elements = Array.isArray(elements) ? elements : [elements];

        target.prepend(...elements);

        return new Promise(resolve =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
        );
    }

    async appendAsync(elements: Array<Node> | Node): Promise<void> {
        await BaseComponent._append(elements, this);
    }

    async prependAsync(elements: Array<Node> | Node): Promise<void> {
        await BaseComponent._prepend(elements, this);
    }

    appendShadow(elements: Array<Node> | Node) {
        if (this.#shadowRoot == undefined) return;
        BaseComponent._append(elements, this.#shadowRoot);
    }

    prependShadow(elements: Array<Node> | Node) {
        if (this.#shadowRoot == undefined) return;
        BaseComponent._prepend(elements, this.#shadowRoot);
    }

    async appendShadowAsync(elements: Array<Node> | Node) {
        if (this.#shadowRoot == undefined) return;
        await BaseComponent._append(elements, this.#shadowRoot);
    }

    async prependShadowAsync(elements: Array<Node> | Node) {
        if (this.#shadowRoot == undefined) return;
        await BaseComponent._prepend(elements, this.#shadowRoot);
    }

    queryShadow(selector: string): Element | null {
        if (this.#shadowRoot == undefined) return null;
        return this.#shadowRoot.querySelector(selector);
    }

    queryShadowAll(selector: string): NodeListOf<Element> {
        if (this.#shadowRoot == undefined) return document.createDocumentFragment().childNodes as NodeListOf<Element>;
        return this.#shadowRoot.querySelectorAll(selector);
    }

    injectStylesheet(stylesheet: CSSStyleSheet) {
        if (!this._options.hasShadowRoot) return;
        this.#shadowRoot?.adoptedStyleSheets.push(stylesheet);
    }

    protected _log(message: string): void {
        if (this._options.debug) console.log(message);
    }

    protected async _init(): Promise<void> {
        let fallbackChildrenParent: BaseComponent | ShadowRoot = this;

        // init shadowRoot

        if (this._options.hasShadowRoot) {
            if (this._options.shadowRootInit == undefined) throw new Error('Error thrown missing ShadowRootInit.');

            this.#shadowRoot = this.attachShadow(this._options.shadowRootInit);

            this.#shadowRoot.adoptedStyleSheets = [...(this.constructor as typeof BaseComponent).stylesheets];

            fallbackChildrenParent = this.#shadowRoot;
        }

        // init fallbackChildren

        if (this._options.fallbackChildren != undefined) {
            const elements = [];

            for (const fc of this._options.fallbackChildren) {
                const selector = getFallbackChildSelector(fc);
                
                const present = this.querySelector(selector);

                elements.push(!present ? createFallbackChild(fc) : present);
            }

            await BaseComponent._append(elements, fallbackChildrenParent);
        }
    }

    protected _destroy(): void {

    }

    static define(tagName: string) {
        customElements.define(tagName, this._cls);
    }

    connectedCallback(): void {
        this._init().then(() => {
            this.addState('initialized');
            this.dispatchEvent(new Event('initialized'));
            this._log(`${this.tagName.toLowerCase()} initialized.`);
        });
    }

    disconnectedCallback(): void {
        this._destroy();
        this._log(`${this.tagName.toLowerCase()} destroyed.`);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        this._log(`attribute: ${name}, oldValue: ${oldValue}, newValue: ${newValue}`);
    }
}