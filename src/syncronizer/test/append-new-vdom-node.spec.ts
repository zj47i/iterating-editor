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

    test("appendNewVDomNode", () => {
        const vP3 = new VDomNode(VDomNodeType.PARAGRAPH);
        sync.appendNewVDomNode(vDom, vP3);
        expect(vDom.getChildren().length).toBe(3);
        expect(dom.getChildren().length).toBe(3);

        expect(vP3.getParent()).toBe(vDom);
        expect(vP2.getNextSibling()).toBe(vP3);
        expect(vP3.getPreviousSibling()).toBe(vP2);

        const p3 = sync.findDomNodeFrom(vP3);
        expect(p3.getElement().parentElement).toBe(dom.getElement());
        expect(p2.getElement().nextElementSibling).toBe(p3.getElement());
        expect(p3.getElement().previousElementSibling).toBe(p2.getElement());
    });
});
