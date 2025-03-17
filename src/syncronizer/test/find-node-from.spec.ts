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

    test("findVDomNodeFrom", () => {
        const vSpan3 = new VDomNode(VDomNodeType.SPAN);
        const vSpan4 = new VDomNode(VDomNodeType.SPAN);
        const vSpan5 = new VDomNode(VDomNodeType.SPAN);
        sync.appendNewVDomNode(vP1, vSpan5);
        sync.addNewNextSiblings(vSpan1, [vSpan3, vSpan4]);

        const span3 = sync.findDomNodeFrom(vSpan3);
        const span4 = sync.findDomNodeFrom(vSpan4);
        const span5 = sync.findDomNodeFrom(vSpan5);

        expect(vSpan3).toEqual(sync.findVDomNodeFrom(span3));
        expect(vSpan4).toEqual(sync.findVDomNodeFrom(span4));
        expect(vSpan5).toEqual(sync.findVDomNodeFrom(span5));

    });
});
