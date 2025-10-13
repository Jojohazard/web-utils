import type { BaseComponentOptions } from '../base/base-component-options.js';
import { BaseComponent } from '../base/base-component.js';

export class StagedForm extends BaseComponent {
    constructor
    (
        submitHandler?: () => void | undefined,
        options?: BaseComponentOptions
    ) {
        super(options);
        this.#submitHandler = submitHandler;
    }

    #form: HTMLFormElement | undefined = undefined;
    #submitHandler: undefined | (() => void) = undefined;

    get form(): HTMLFormElement {
        if (this.#form == undefined) {
            this.#form = this.querySelector('form') as HTMLFormElement;
        }

        return this.#form;
    }

    get stages(): undefined {
        return undefined;
    }

    set submitHandler(submitHandler: () => void) {
        this.#submitHandler = submitHandler;
    }
}