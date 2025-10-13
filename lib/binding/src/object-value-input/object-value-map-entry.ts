import type { ValidationMapEntry } from "../validation/validation-map-entry.js";

export interface ObjectValueMapEntry {
    validation?: ValidationMapEntry | undefined;
    attributeName?: string | undefined;
}