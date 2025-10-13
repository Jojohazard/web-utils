import type { ValidationRule } from "./validation-rule.js";

export interface DefaultValidationRulesInterface {
    isString: ValidationRule;
    isNumber: ValidationRule;
    isInteger: ValidationRule;
}