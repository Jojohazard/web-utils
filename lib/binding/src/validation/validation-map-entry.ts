import type { ValidationPipeline } from './validation-pipeline.js';
import type { ValidationRule } from './validation-rule.js';

export interface ValidationMapEntry {
    validateable?: ValidationRule | ValidationPipeline | undefined;
    errorMessage?: string | undefined;
}