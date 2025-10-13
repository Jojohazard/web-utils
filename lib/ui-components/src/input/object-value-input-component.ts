import type { ObjectValueFactory } from "binding";
import type { BaseComponentOptions } from "../base/base-component-options.js";
import { InputComponent } from "./input-component.js";

export class ObjectValueInputComponent extends InputComponent {
    constructor(
        factory?: ObjectValueFactory,
        options?: BaseComponentOptions
    ) {
        super(options);
        this.#factory = factory;
    }

    #factory: ObjectValueFactory | undefined;
    #value: unknown | Record<string, object | unknown>;

    get factory(): ObjectValueFactory | undefined {
        return this.#factory;
    }

    set factory(factory: ObjectValueFactory) {
        if (this.#factory != undefined) return;
        this.#factory = factory;
    }

    protected set value(value: Record<string, unknown> | unknown) {
        if (this.#factory != undefined) {
            try {
                super.value = this.#factory.buildObject(value as Record<string, unknown>);
            } catch(e) {
                throw e;
            }

            return;
        }

        super.value = value;

        this.dispatchEvent(new Event('change'));
    }
}