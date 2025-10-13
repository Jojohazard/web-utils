export class ObjectValueValidationException extends Error {
    constructor(validationError: string | undefined) {
        super(`Object value validation exception thrown error: ${validationError}`);
    }
}