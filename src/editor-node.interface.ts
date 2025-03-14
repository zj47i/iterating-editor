import { TextFormat } from "./enum/text-format.enum";

export interface EditorNode<T> {
    setFormat(format: TextFormat): void;
    absorb(other: T): void;
    empty(): void;
    remove(): void;
    append(node: T): void;
    isEmpty(): boolean;
    getPreviousSibling(): T | undefined;
    getNextSibling(): T | undefined;
    addNextSiblings(siblings: T[]): void;
    getParent(): T | undefined;
}
