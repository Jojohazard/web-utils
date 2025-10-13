import type { ValidationMap } from './validation-map.js';
import type { ValidationOutput } from './validation-output.js';
import { ValidationPipeline } from './validation-pipeline.js';
import type { ValidationTarget } from './validation-target.js';

export class Validator {
    constructor(validationMap: ValidationMap) {
        this.#validationMap = validationMap;
    }

    #validationMap: ValidationMap;

    validate(target: ValidationTarget): ValidationOutput {
        const targetKeys: string[] = Object.keys(target).sort();
        const validationMapKeys: string[] = Object.keys(this.#validationMap);

        if (!targetKeys.every(key => validationMapKeys.includes(key))) {
            return { isValid: false, errors: {schema: `schema mismatch:  targetKeys: ${targetKeys.join(', ')} schemaKeys: ${validationMapKeys.join(', ')}`} };
        }

        let isValid = true;
        const errors: Record<string, string | undefined> = {};

        for (const [key, entry] of Object.entries(this.#validationMap)) {
            if (entry.validateable == undefined) {
                continue;
            }
            else if (entry.validateable instanceof ValidationPipeline) {
                if (!entry.validateable.validate(target[key])) {
                    isValid = false;
                    errors[key] = entry.errorMessage;
                }
            }
            else {
                if (!entry.validateable(target[key])) {
                    isValid = false;
                    errors[key] = entry.errorMessage;
                }
            }
        }

        return { isValid, errors };
    }
}