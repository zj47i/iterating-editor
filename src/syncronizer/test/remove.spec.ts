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

    test("remove", () => {
        const vSpan3 = new VDomNode(VDomNodeType.SPAN);
        sync.appendNewVDomNode(vP1, vSpan3);
        const span3 = sync.findDomNodeFrom(vSpan3);

        sync.remove(vSpan3);
        expect(vP1.getChildren().length).toBe(1);
        expect(p1.getElement().children.length).toBe(1);

        sync.remove(vSpan1);
        expect(vP1.getChildren().length).toBe(0);
        expect(p1.getChildren().length).toBe(0);
        expect(p1.getElement().innerHTML).toBe("<br>");

        expect(vP1.isEmpty()).toBe(true);
        expect(p1.isEmpty()).toBe(true);
    });
});
