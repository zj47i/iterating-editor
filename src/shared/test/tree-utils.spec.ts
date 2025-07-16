import { TreeUtils } from '../tree-utils';

// Simple test implementation of TreeNode
class TestNode {
    children: TestNode[] = [];
    parent: TestNode | null = null;
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    addChild(child: TestNode): void {
        this.children.push(child);
        child.parent = this;
    }

    getChildren(): TestNode[] {
        return this.children;
    }

    getParent(): TestNode | null {
        return this.parent;
    }
}

describe('TreeUtils', () => {
    let root: TestNode;
    let child1: TestNode;
    let child2: TestNode;
    let grandchild1: TestNode;
    let grandchild2: TestNode;

    beforeEach(() => {
        root = new TestNode('root');
        child1 = new TestNode('child1');
        child2 = new TestNode('child2');
        grandchild1 = new TestNode('grandchild1');
        grandchild2 = new TestNode('grandchild2');

        root.addChild(child1);
        root.addChild(child2);
        child1.addChild(grandchild1);
        child1.addChild(grandchild2);
    });

    describe('preOrderTraversal', () => {
        it('should traverse nodes in pre-order', () => {
            const result = TreeUtils.preOrderTraversal(root);
            const values = result.map(node => node.value);
            expect(values).toEqual(['root', 'child1', 'grandchild1', 'grandchild2', 'child2']);
        });
    });

    describe('levelOrderTraversal', () => {
        it('should traverse nodes in level-order', () => {
            const result = TreeUtils.levelOrderTraversal(root);
            const values = result.map(node => node.value);
            expect(values).toEqual(['root', 'child1', 'child2', 'grandchild1', 'grandchild2']);
        });
    });

    describe('findPathToRoot', () => {
        it('should find correct path to root', () => {
            const path = TreeUtils.findPathToRoot(grandchild1, (node) => node.value === 'root');
            expect(path).toEqual([0, 0]); // grandchild1 is 0th child of child1, child1 is 0th child of root
        });
    });

    describe('getPreviousSibling', () => {
        it('should return previous sibling', () => {
            const sibling = TreeUtils.getPreviousSibling(grandchild2);
            expect(sibling?.value).toBe('grandchild1');
        });

        it('should return null for first child', () => {
            const sibling = TreeUtils.getPreviousSibling(grandchild1);
            expect(sibling).toBeNull();
        });
    });

    describe('getNextSibling', () => {
        it('should return next sibling', () => {
            const sibling = TreeUtils.getNextSibling(grandchild1);
            expect(sibling?.value).toBe('grandchild2');
        });

        it('should return null for last child', () => {
            const sibling = TreeUtils.getNextSibling(grandchild2);
            expect(sibling).toBeNull();
        });
    });

    describe('findLowestCommonAncestor', () => {
        it('should find correct LCA', () => {
            const lca = TreeUtils.findLowestCommonAncestor(
                grandchild1,
                grandchild2,
                (node) => root
            );
            expect(lca.value).toBe('child1');
        });

        it('should find root as LCA for different branches', () => {
            const lca = TreeUtils.findLowestCommonAncestor(
                grandchild1,
                child2,
                (node) => root
            );
            expect(lca.value).toBe('root');
        });
    });
});