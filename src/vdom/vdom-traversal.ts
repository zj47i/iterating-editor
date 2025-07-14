import { VDomNode } from "./vdom-node";

/**
 * Utility class for VDomNode tree traversal operations
 */
export class VDomTraversal {
    /**
     * Performs pre-order traversal of the VDom tree
     * @param from Starting node for traversal
     * @returns Array of nodes in pre-order
     */
    public static preOrderTraversal(from: VDomNode): VDomNode[] {
        const stack: VDomNode[] = [from];
        const result: VDomNode[] = [];

        while (stack.length > 0) {
            const current = stack.pop()!;
            result.push(current);

            for (let i = current.getChildren().length - 1; i >= 0; i--) {
                stack.push(current.getChildren()[i]);
            }
        }

        return result;
    }

    /**
     * Finds the lowest common ancestor of two nodes
     * @param node1 First node
     * @param node2 Second node
     * @returns Lowest common ancestor node
     */
    public static findLowestCommonAncestor(
        node1: VDomNode,
        node2: VDomNode
    ): VDomNode {
        const path1 = node1.findPathToRoot();
        const path2 = node2.findPathToRoot();
        const setPath2 = new Set(path2);
        for (const node of path1) {
            if (setPath2.has(node)) {
                return node;
            }
        }
        throw new Error("no common ancestor");
    }

    /**
     * Determines left-right order of two nodes
     * @param node1 First node
     * @param node2 Second node
     * @returns Tuple of nodes in left-right order
     */
    public static determineLeftRight(
        node1: VDomNode,
        node2: VDomNode
    ): [VDomNode, VDomNode] {
        const ancestor = VDomTraversal.findLowestCommonAncestor(node1, node2);
        const path1 = node1.findPathToAncestorNode(ancestor);
        const path2 = node2.findPathToAncestorNode(ancestor);
        
        if (path1.length === 1) {
            return [node1, node2];
        }
        if (path2.length === 1) {
            return [node2, node1];
        }
        
        const index1 = path1[path1.length - 1].getChildren().indexOf(
            path1[path1.length - 2]
        );
        const index2 = path2[path2.length - 1].getChildren().indexOf(
            path2[path2.length - 2]
        );
        
        if (index1 < index2) {
            return [node1, node2];
        }
        if (index1 > index2) {
            return [node2, node1];
        }

        return [node1, node2];
    }

    /**
     * Finds all VDom nodes between two nodes
     * @param left Left boundary node
     * @param right Right boundary node
     * @returns Array of nodes between the boundaries
     */
    public static findVDomNodesBetween(
        left: VDomNode,
        right: VDomNode
    ): VDomNode[] {
        const result: VDomNode[] = [];

        const ancestor = VDomTraversal.findLowestCommonAncestor(left, right);
        const path1 = left.findPathToAncestorNode(ancestor);
        const path2 = right.findPathToAncestorNode(ancestor);

        if (path1.length === 1) {
            result.push(...VDomTraversal.traversalBeforePath(path2));
            return result;
        }
        if (path2.length === 1) {
            result.push(...VDomTraversal.traversalBeforePath(path1));
            return result;
        }

        const index1 = ancestor.getChildren().indexOf(path1[path1.length - 2]);
        const index2 = ancestor.getChildren().indexOf(path2[path2.length - 2]);

        result.push(
            ...VDomTraversal.traversalAfterPath(path1.slice(0, path1.length - 1))
        );
        
        for (let i = index1 + 1; i < index2; i++) {
            result.push(...VDomTraversal.preOrderTraversal(ancestor.getChildren()[i]));
        }
        
        result.push(
            ...VDomTraversal.traversalBeforePath(path2.slice(0, path2.length - 1))
        );

        return result;
    }

    /**
     * Traverses nodes after a given path
     * @param path Array of nodes representing a path
     * @returns Array of nodes after the path
     */
    public static traversalAfterPath(path: VDomNode[]): VDomNode[] {
        const result: VDomNode[] = [];
        if (path.length === 1) {
            result.push(path[0]);
            return result;
        }

        const stack: VDomNode[] = [];

        let i = path.length - 2;
        while (i >= 0) {
            const current = path[i];
            const parent = current.getParent();
            if (parent) {
                const index = parent.getChildren().indexOf(current);
                for (let j = parent.getChildren().length - 1; j >= index; j--) {
                    stack.push(parent.getChildren()[j]);
                }
            }
            i--;
        }

        while (stack.length > 0) {
            const current = stack.pop()!;
            const index = path.indexOf(current);
            if (index === -1) {
                result.push(...VDomTraversal.preOrderTraversal(current));
                continue;
            }
            if (index === 0) {
                result.push(current);
                continue;
            }
        }

        return result;
    }

    /**
     * Traverses nodes before a given path
     * @param p Array of nodes representing a path
     * @returns Array of nodes before the path
     */
    public static traversalBeforePath(p: VDomNode[]): VDomNode[] {
        const path = Array.from(p);
        const states: VDomNode[] = [];
        states.push(path.pop()!);
        
        while (path.length > 0) {
            const current = path.pop()!;
            const parent = current.getParent();
            if (!parent) {
                throw new Error("no parent");
            }
            const index = parent.getChildren().indexOf(current);
            if (index >= 1) {
                for (let i = 0; i < index; i++) {
                    states.push(
                        ...VDomTraversal.preOrderTraversal(parent.getChildren()[i])
                    );
                }
            }
            states.push(current);
        }

        return states;
    }
}