import type { BaseComponentOptions } from '../base/base-component-options.js';
import { BaseComponent } from '../base/base-component.js';

export class InputComponent extends BaseComponent {
    constructor(
        options?: BaseComponentOptions
    ) {
        super(options);
    }

    #value: unknown;

    protected set value(value: unknown) {
        this.#value = value;
    }

    getValue() {
        return this.#value;
    }
}