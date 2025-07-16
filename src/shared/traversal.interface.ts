/**
 * Shared tree utilities for common navigation and traversal operations
 * Used by both DomNode and VDomNode to reduce code duplication
 */

import { TraversalNode } from "./traversal-node.interface";

/**
 * Generic tree traversal utilities interface
 */
export interface Traversal<T extends TraversalNode<T>> {
    preOrderTraversal(from: T): T[];
    levelOrderTraversal(from: T): T[];
    findPathToRoot(node: T, isRoot: (node: T) => boolean): number[];
    findLowestCommonAncestor(node1: T, node2: T, getRoot: (node: T) => T): T;
    findPathToAncestor(node: T, ancestor: T): T[];
    getSibling(node: T, offset: number): T | null;
    getPreviousSibling(node: T): T | null;
    getNextSibling(node: T): T | null;
}
