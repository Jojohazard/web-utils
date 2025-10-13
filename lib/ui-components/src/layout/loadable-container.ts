import { BaseComponent } from "../base/base-component.js";

export class LoadableContainer extends BaseComponent {
    constructor() {
        super();

        this.#boundTargetLoadHandler = this.#handleTargetLoad.bind(this);
    }

    #loadedCount: number = 0;
    #targets: NodeListOf<Element> | undefined = undefined;
    #loaded: boolean = false;
    #boundTargetLoadHandler: () => void;
    #reloadPromise: Promise<void> | null = null;

    get targets(): NodeListOf<Element> {
        if (this.#targets == undefined) this.#targets = this.querySelectorAll('img, video, audio, iframe, jwc-loadable-container, .lc__target');
        return this.#targets;
    }

    get loaded(): boolean {
        return this.#loaded;
    }

    #handleTargetLoad(): void {
        if (this.#loaded) return;

        this.#loadedCount++;

        if (this.#loadedCount === this.targets.length) {
            this.addState('loaded');
            this.#loaded = true;
            this.dispatchEvent(new Event('load'));

            for (const target of this.targets) {
                if (target instanceof HTMLImageElement || target instanceof LoadableContainer || target instanceof HTMLIFrameElement) {
                    target.removeEventListener('load', this.#boundTargetLoadHandler);
                }
                else if (target instanceof HTMLVideoElement || target instanceof HTMLAudioElement) {
                    target.removeEventListener('loadeddata', this.#boundTargetLoadHandler);
                }
                else if (target instanceof BaseComponent && target.classList.contains('lc__target')) {
                    target.removeEventListener('initialized', this.#boundTargetLoadHandler)
                }
            }
        }
    }

    async reload(): Promise<void> {
        if (this.#reloadPromise) {
            await this.#reloadPromise;
        }
        this.deleteState('loaded');
        this.#loadedCount = 0;
        this.#loaded = false;
        this.#targets = undefined;
        this.#reloadPromise = this._init();
        await this.#reloadPromise;
        this.#reloadPromise = null;
    }

    protected async _init(): Promise<void> {
        await super._init();

        for (const target of this.targets) {
            if (target instanceof HTMLImageElement) {
                if (!target.complete || target.naturalWidth == 0) {
                    target.addEventListener('load', this.#boundTargetLoadHandler);
                    continue;
                }

                this.#handleTargetLoad();
            }
            else if (target instanceof HTMLVideoElement || target instanceof HTMLAudioElement) {
                if (target.readyState < 3) { // HAVE_FUTURE_DATA
                    target.addEventListener('loadeddata', this.#boundTargetLoadHandler);
                    continue;
                }

                this.#handleTargetLoad();
            }
            else if (target instanceof LoadableContainer) {
                if (!target.loaded) {
                    target.addEventListener('load', this.#boundTargetLoadHandler);
                    continue;
                }

                this.#handleTargetLoad();
            }
            else if (target instanceof HTMLIFrameElement) {
                if (!target.contentDocument || target.contentDocument.readyState !== "complete") {
                    target.addEventListener('load', this.#boundTargetLoadHandler);
                    continue;
                }

                this.#handleTargetLoad();
            }
            else if (target instanceof BaseComponent && target.classList.contains('lc__target')) {
                if (!target.hasState('initialized')) {
                    target.addEventListener('initialized', this.#boundTargetLoadHandler);
                    continue;
                }

                this.#handleTargetLoad();
            }
        }
    }
}