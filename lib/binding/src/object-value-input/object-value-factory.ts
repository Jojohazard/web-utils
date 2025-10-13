import { InvalidSchemaException } from '../exceptions/invalid-schema-exception.js';
import { MissingComponentKeyException } from '../exceptions/missing-component-key-exception.js';
import { ObjectValueValidationException } from '../exceptions/object-value-validation-exception.js';
import { ValidationPipeline } from '../validation/validation-pipeline.js';
import type { FunctionMap } from './function-map.js';
import type { ObjectValueMap } from './object-value-map.js';

export class ObjectValueFactory {
    constructor(schema: ObjectValueMap, functions?: FunctionMap | undefined) {
        this.#schema = schema;
        this.#functions = functions;
    }

    #schema: ObjectValueMap;
    #functions: FunctionMap | undefined;

    #validateObject(object: Record<string, unknown>): boolean {
        const inputSchema = Object.keys(object);
        const targetSchema = Object.keys(this.#schema)

        if (!targetSchema.every((val, index) => val === inputSchema[index])) {
            throw new InvalidSchemaException(targetSchema, inputSchema);
        }

        for (const [key, schemaEntry] of Object.entries(this.#schema)) {
            if (schemaEntry.validation == undefined || schemaEntry.validation.validateable == undefined) continue;
            else if (schemaEntry.validation.validateable instanceof ValidationPipeline) {
                if (!schemaEntry.validation.validateable.validate(object[key])) {
                    throw new ObjectValueValidationException(schemaEntry.validation.errorMessage);
                }
            }
            else {
                if (!schemaEntry.validation.validateable(object[key])) {
                    throw new ObjectValueValidationException(schemaEntry.validation.errorMessage);
                }
            }
        }

        return true;
    }

    extractObject(component: HTMLElement): object {
        const object: Record<string, string> = {};

        for (const [key, schemaEntry] of Object.entries(this.#schema)) {
            let attribute: string | null;

            if (schemaEntry.attributeName != undefined) {
                attribute = component.getAttribute(schemaEntry.attributeName);
            }
            else {
                attribute = component.getAttribute(key);

            }

            if (attribute == undefined) {
                throw new MissingComponentKeyException(key);
            }

            object[key] = attribute;
        }

        return object;
    }

    buildObject(object: Record<string, unknown>): object {
        try {
            this.#validateObject(object);
        }
        catch (e) {
            throw e;
        }

        if (this.#functions != undefined) {
            for (const [fnName, fn] of Object.entries(this.#functions)) {
                if (typeof fn == 'function') {
                    object[fnName] = fn.bind(object);
                }
            }
        }

        return object;
    }
}