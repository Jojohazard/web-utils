export interface ValidationOutput {
    isValid: boolean;
    errors?: Record<string, string | undefined> | undefined;
}