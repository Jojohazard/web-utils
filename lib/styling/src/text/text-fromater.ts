import type { Decoration } from "./decoration.js";

export class TextFormater {
    constructor(textContainer: HTMLElement) {
        this.#textContainer = textContainer;
        this.#textContainer.innerHTML = this.#textContainer.innerHTML.trim();
    }

    #textContainer: HTMLElement;

    get containerChildNodes(): Node[] {
        return Array.from(this.#textContainer.childNodes);
    }

    static getSelectionRanges(selection: Selection) {
        const ranges = [];

        for (let i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i));
        }

        return ranges;
    }

    #selectionContainsUnDecorated(
        startNodeIndex: number,
        endNodeIndex: number,
        startOffset: number,
        endOffset: number,
        decoration: Decoration) {
        const childNodes = this.containerChildNodes;

        for (let i = startNodeIndex; i <= endNodeIndex && i < childNodes.length; i++) {
            const node = childNodes[i] as Node;

            const text = node.textContent || '';
            const nodeLength = text.length;

            const selStart = (i === startNodeIndex) ? startOffset : 0;
            const selEnd = (i === endNodeIndex) ? endOffset : nodeLength;

            if (selStart >= selEnd) continue;

            let decorated = false;

            if (node.nodeType === Node.ELEMENT_NODE) {
                decorated = (node as Element).classList.contains(decoration);
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                decorated = (node.parentElement as Element).classList.contains(decoration);
            }

            if (!decorated) {
                return true;
            }
        }

        return false;
    }

    #validateRange(range: Range): boolean {
        return true;
    }

    #getRangeIndexes(range: Range) {
        const childNodes = this.containerChildNodes;

        const startContainer = range.startContainer.parentElement === this.#textContainer
            ? range.startContainer
            : range.startContainer.parentElement;

        const endContainer = range.endContainer.parentElement === this.#textContainer
            ? range.endContainer
            : range.endContainer.parentElement;

        let start = childNodes.indexOf(startContainer as ChildNode);
        let end = childNodes.indexOf(endContainer as ChildNode);

        let startOffset = startContainer === endContainer
            ? Math.min(range.startOffset, range.endOffset)
            : range.startOffset;

        let endOffset = startContainer === endContainer
            ? Math.max(range.startOffset, range.endOffset)
            : range.endOffset;

        if (range.collapsed) {
            end = childNodes.length - 1;
            const lastNode = childNodes[childNodes.length - 1] as Node;
            endOffset = lastNode.textContent?.length ?? 0;
        }

        return {
            start: {
                nodeIndex: Math.min(start, end),
                offset: startOffset
            },
            end: {
                nodeIndex: Math.max(start, end),
                offset: endOffset
            }
        };
    }

    #toggleDecorationOnNode(
        node: Node,
        startOffset: number,
        endOffset: number,
        decoration: Decoration,
        decorateAll: boolean
    ) {
        if (startOffset === node.textContent?.length || endOffset === 0) return [node];

        const left = node.textContent?.substring(0, startOffset);
        const right = node.textContent?.substring(endOffset, node.textContent.length);
        const selected = node.textContent?.substring(startOffset, endOffset);
        let copy = node.cloneNode(true);

        const leftCopy = copy.cloneNode(true);
        const rightCopy = copy.cloneNode(true);
        leftCopy.textContent = left as string;
        rightCopy.textContent = right as string;

        if (node.nodeType === Node.ELEMENT_NODE) {
            if (decorateAll) {
                (copy as Element).classList.add(decoration);
            }
            else {
                (copy as Element).classList.toggle(decoration);
            }
        }
        else {
            copy = document.createElement('span');
            (copy as Element).classList.add(decoration);
        }

        copy.textContent = selected as string;

        return [leftCopy, copy, rightCopy];
    }

    #toggleDecoration(
        startNodeIndex: number,
        endNodeIndex: number,
        startOffset: number,
        endOffset: number,
        decoration: Decoration
    ) {
        const childNodes = this.containerChildNodes;
        const decorateAll = this.#selectionContainsUnDecorated(startNodeIndex, endNodeIndex, startOffset, endOffset, decoration);

        for (let i = startNodeIndex; i <= endNodeIndex && i < childNodes.length; i++) {
            if (i < 0) break;
            const node = childNodes[i] as ChildNode;
            const nodeLength = node?.textContent?.length;
            let transformation;

            if (i === startNodeIndex && i == endNodeIndex) {
                transformation = this.#toggleDecorationOnNode(node, startOffset, endOffset, decoration, decorateAll);
            }
            else if (i === startNodeIndex) {
                transformation = this.#toggleDecorationOnNode(node, startOffset, nodeLength as number, decoration, decorateAll);
            }
            else if (i === endNodeIndex) {
                console.log('last node');
                transformation = this.#toggleDecorationOnNode(node, 0, endOffset, decoration, decorateAll);
            }
            else {
                console.log('middle node');
                transformation = this.#toggleDecorationOnNode(node, 0, nodeLength as number, decoration, decorateAll);
            }

            node.replaceWith(...transformation);
        }
    }

    toggle(selectionRanges: Range[], decoration: Decoration) {
        for (let i = 0; i < selectionRanges.length; i++) {
            if (this.#validateRange(selectionRanges[i] as Range)) {
                const indexes = this.#getRangeIndexes(selectionRanges[i] as Range);

                this.#toggleDecoration(
                    indexes.start.nodeIndex,
                    indexes.end.nodeIndex,
                    indexes.start.offset,
                    indexes.end.offset,
                    decoration
                );

                console.log(
                    indexes.start.nodeIndex,
                    indexes.end.nodeIndex,
                    indexes.start.offset,
                    indexes.end.offset,
                    decoration
                );
            }
        }

        window.getSelection()?.removeAllRanges();
    }
}