import type { FallbackChild } from "./base-helpers.js";

export interface BaseComponentOptions {
    debug?: boolean | undefined;
    hasShadowRoot?: boolean | undefined;
    shadowRootInit?: ShadowRootInit | undefined;
    fallbackChildren?: FallbackChild[] | undefined;
}