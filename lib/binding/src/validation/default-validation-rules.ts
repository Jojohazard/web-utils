import type { DefaultValidationRulesInterface } from './default-validation-rules-interface.js';

export const defaultValidationRules: DefaultValidationRulesInterface = {
    isString: function (value) {
        return typeof value === 'string';
    },
    isNumber: function (value) {
        return !isNaN(Number(value));
    },
    isInteger: function (value) {
        const num = Number(value);
        return !isNaN(num) && Number.isInteger(num);
    }
}