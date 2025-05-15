import "@testing-library/jest-dom";
import { mockSyncronizer } from "./syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer";
import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";
import { VDomNodeType } from "../../vdom/vdom-node.enum";

describe("syncronizer", () => {
    let sync: Synchronizer,
        dom: DomNode,
        vDom: VDomNode,
        vP1: VDomNode,
        p1: DomNode,
        vP2: VDomNode,
        p2: DomNode,
        vSpan1: VDomNode,
        span1: DomNode,
        vSpan2: VDomNode,
        span2: DomNode;
    beforeEach(() => {
        ({ sync, dom, vDom, vP1, p1, vP2, p2, vSpan1, span1, vSpan2, span2 } =
            mockSyncronizer());
    });
    afterEach(() => {
        sync.checkSync();
    });

    test("addNewNextSiblings", () => {
        const vSpan3 = VDomNode.createVSpan("");
        const vSpan4 = VDomNode.createVSpan("");
        const vSpan5 = VDomNode.createVSpan("");
        sync.appendNewVDomNode(vP1, vSpan5);
        sync.addNewNextSiblings(vSpan1, [vSpan3, vSpan4]);

        const vChildren = vP1.getChildren();
        expect(vChildren.length).toBe(4);
        expect(vChildren[0]).toBe(vSpan1);
        expect(vChildren[1]).toBe(vSpan3);
        expect(vChildren[2]).toBe(vSpan4);
        expect(vChildren[3]).toBe(vSpan5);

        const childrent = p1.getChildren();
        expect(childrent.length).toBe(4);
        expect(childrent[0]).toBe(sync.findDomNodeFrom(vSpan1));
        expect(childrent[1]).toBe(sync.findDomNodeFrom(vSpan3));
        expect(childrent[2]).toBe(sync.findDomNodeFrom(vSpan4));
        expect(childrent[3]).toBe(sync.findDomNodeFrom(vSpan5));
    });
});
