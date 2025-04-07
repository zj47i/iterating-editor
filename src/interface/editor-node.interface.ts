import { TextFormat } from "../enum/text-format";

export interface EditorNode<T> {
    getChildren(): T[];
    setFormat(format: TextFormat): void;
    getFormats(): TextFormat[];
    absorb(other: T): void;
    empty(): void;
    remove(): void;
    attachLast(node: T): void;
    attach(node: T, at: number): void;
    detach(node: T): T;
    isEmpty(): boolean;
    getPreviousSibling(): T | undefined;
    getNextSibling(): T | undefined;
    addNextSiblings(siblings: T[]): void;
    getParent(): T | undefined;
}
