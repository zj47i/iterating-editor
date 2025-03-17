import "@testing-library/jest-dom";
import { mockSyncronizer } from "./syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer";
import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";

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

    test("merge", () => {
        sync.merge(vP1, vP2);
        expect(vSpan1.getParent()).toBe(vP1);
        expect(vSpan2.getParent()).toBe(vP1);
        expect(span1.getParent()).toBe(p1);
        expect(span2.getParent()).toBe(p1);
        expect(vP2.getChildren().length).toBe(0);
        expect(vP2.getParent()).toBe(null);
        expect(p2.getElement().children.length).toBe(0);
        expect(p2.getElement().parentElement).toBe(null);
    });
});
