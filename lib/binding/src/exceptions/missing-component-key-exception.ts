export class MissingComponentKeyException extends Error {
    constructor(key: string) {
        super(`Missing component key exception thrown key: ${key}`);
    }
}