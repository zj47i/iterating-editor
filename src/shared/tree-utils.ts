/**
 * Shared tree utilities for common navigation and traversal operations
 * Used by both DomNode and VDomNode to reduce code duplication
 */

/**
 * Generic tree node interface for common operations
 */
export interface TreeNode<T> {
    getChildren(): T[];
    getParent(): T | null;
}

/**
 * Generic tree traversal utilities
 */
export class TreeUtils {
    /**
     * Pre-order traversal of tree starting from given node
     */
    static preOrderTraversal<T extends TreeNode<T>>(from: T): T[] {
        const stack: T[] = [from];
        const result: T[] = [];

        while (stack.length > 0) {
            const current = stack.pop()!;
            result.push(current);

            const children = current.getChildren();
            for (let i = children.length - 1; i >= 0; i--) {
                stack.push(children[i]);
            }
        }

        return result;
    }

    /**
     * Level-order (breadth-first) traversal of tree
     */
    static levelOrderTraversal<T extends TreeNode<T>>(from: T): T[] {
        const result: T[] = [from];
        const queue: T[] = [from];

        while (queue.length > 0) {
            const current = queue.shift()!;
            for (const child of current.getChildren()) {
                result.push(child);
                queue.push(child);
            }
        }

        return result;
    }

    /**
     * Find path from node to root (ordered from node up to root)
     */
    static findPathToRoot<T extends TreeNode<T>>(
        node: T,
        isRoot: (node: T) => boolean
    ): number[] {
        const path: number[] = [];
        let current = node;

        while (!isRoot(current)) {
            const parent = current.getParent();
            if (!parent) break;
            
            const index = parent.getChildren().indexOf(current);
            path.push(index);
            current = parent;
        }

        return path;
    }

    /**
     * Find lowest common ancestor of two nodes
     */
    static findLowestCommonAncestor<T extends TreeNode<T>>(
        node1: T,
        node2: T,
        getRoot: (node: T) => T
    ): T {
        const path1 = TreeUtils.findPathToAncestor(node1, getRoot(node1));
        const path2 = TreeUtils.findPathToAncestor(node2, getRoot(node2));
        
        let lca: T | null = null;
        let i = path1.length - 1;
        let j = path2.length - 1;
        
        while (i >= 0 && j >= 0 && path1[i] === path2[j]) {
            lca = path1[i];
            i--;
            j--;
        }
        
        if (!lca) throw new Error("no common ancestor");
        return lca;
    }

    /**
     * Find path from node to specified ancestor
     */
    static findPathToAncestor<T extends TreeNode<T>>(node: T, ancestor: T): T[] {
        const path: T[] = [];
        let current: T | null = node;
        
        while (current && current !== ancestor) {
            path.push(current);
            current = current.getParent();
        }
        
        if (current === ancestor) {
            path.push(ancestor);
        }
        
        return path;
    }

    /**
     * Get sibling at relative position
     */
    static getSibling<T extends TreeNode<T>>(
        node: T,
        offset: number
    ): T | null {
        const parent = node.getParent();
        if (!parent) return null;

        const siblings = parent.getChildren();
        const currentIndex = siblings.indexOf(node);
        const targetIndex = currentIndex + offset;

        if (targetIndex < 0 || targetIndex >= siblings.length) {
            return null;
        }

        return siblings[targetIndex];
    }

    /**
     * Get previous sibling
     */
    static getPreviousSibling<T extends TreeNode<T>>(node: T): T | null {
        return TreeUtils.getSibling(node, -1);
    }

    /**
     * Get next sibling
     */
    static getNextSibling<T extends TreeNode<T>>(node: T): T | null {
        return TreeUtils.getSibling(node, 1);
    }
}