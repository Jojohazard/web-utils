export class InvalidSchemaException extends Error {
    constructor(inputSchema: string[], factorySchema: string[]) {
        super(`Schema mismatch exception thrown targetSchema: ${inputSchema.join(', ')}, factorySchema: ${factorySchema.join(', ')}`);
    }
}