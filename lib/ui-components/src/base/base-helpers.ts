export interface FallbackChild {
    tagName: string;
    classes?: string[];
    textContent?: string;
    attributes?: Record<string, string>;
}

export function getFallbackChildSelector(fallbackChild: FallbackChild): string {
    const classSelector = fallbackChild.classes?.map(c => `.${c}`);
    const attributeSelector = fallbackChild.attributes != undefined ? Object.entries(fallbackChild.attributes).map(([key, value]) => `[${key}="${value}"]`).join('') : '';

    return `${fallbackChild.tagName}${classSelector}${attributeSelector}`;
}

export function createFallbackChild(fallbackChild: FallbackChild): HTMLElement {
    const element = document.createElement(fallbackChild.tagName);

    if (fallbackChild.classes != undefined) {
        element.classList.add(...fallbackChild.classes);
    }

    if (fallbackChild.textContent != undefined) {
        element.textContent = fallbackChild.textContent;
    }

    if (fallbackChild.attributes != undefined) {
        for (const [key, value] of Object.entries(fallbackChild.attributes)) {
            element.setAttribute(key, value);
        }
    }

    return element;
}

export function prepareStylesheets(styles: string | string[]): CSSStyleSheet[] {
    const styleList = Array.isArray(styles) ? styles : [styles];

    return styleList.map(style => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(style);
        return sheet;
    });
}