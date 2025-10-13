import type { ValidationRule } from './validation-rule.js';

export class ValidationPipeline {
    constructor(...rules: ValidationRule[]) {
        this.#rules = rules;
    }

    #rules: ValidationRule[];

    validate(value: unknown): boolean {
        for (const rule of this.#rules) {
            if (!rule(value)) {
                return false;
            }
        }

        return true;
    }
}