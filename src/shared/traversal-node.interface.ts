/**
 * Generic tree node interface for common operations
 */
export interface TraversalNode<T> {
    getChildren(): T[];
    getParent(): T | null;
}
