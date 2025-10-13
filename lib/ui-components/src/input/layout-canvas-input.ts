import { InputComponent } from "./input-component.js";

export class LayoutCanvasInput extends InputComponent {
    constructor() {
        super(
            {
                fallbackChildren: [
                    { tagName: 'wu-canvas-resizer', classes: ['left'] },
                    { tagName: 'wu-canvas-resizer', classes: ['bottom'] },
                    { tagName: 'wu-canvas-resizer', classes: ['right__bottom'] },
                    { tagName: 'wu-canvas-editor-panel' }
                ],
                hasShadowRoot: true,
                shadowRootInit: {
                    mode: 'closed'
                }
            }
        );
    }

    #position: { startX: number, startY: number, endX: number, endY: number } | undefined;

    get position(): { startX: number, startY: number, endX: number, endY: number } {
        if (this.#position == undefined) {
            throw new Error('Position uninitialized error thrown');
        }

        return this.#position;
    }

    protected async _init(): Promise<void> {
        const rect = this.getBoundingClientRect();
        this.#position = {
            startX: rect.left,
            startY: rect.top,
            endX: rect.right,
            endY: rect.bottom
        };

        await super._init();
    }
}