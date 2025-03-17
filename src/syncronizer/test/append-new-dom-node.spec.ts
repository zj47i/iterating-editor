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

    test("appendNewDomNode", () => {
        const p3 = DomNode.createParagraph();
        sync.appendNewDomNode(dom, p3);
        expect(p3.getParent()).toBe(dom);
        expect(p2.getNextSibling()).toBe(p3);
        expect(p3.getPreviousSibling()).toBe(p2);

        const vP3 = sync.findVDomNodeFrom(p3);
        expect(vP3.getParent()).toBe(vDom);
        expect(vP2.getNextSibling()).toBe(vP3);
        expect(vP3.getPreviousSibling()).toBe(vP2);
    });
});
