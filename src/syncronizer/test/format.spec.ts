import "@testing-library/jest-dom";
import { mockSyncronizer } from "./syncronizer.mock.spec";
import { Synchronizer } from "../syncronizer";
import { DomNode } from "../../dom/dom-node";
import { VDomNode } from "../../vdom/vdom-node";
import { TextFormat } from "../../enum/text-format";

describe("syncronizer", () => {
    let sync: Synchronizer,
        dom: DomNode,
        vDom: VDomNode,
        vP1: VDomNode,
        vP2: VDomNode,
        vSpan1: VDomNode,
        span1: DomNode,
        vSpan2: VDomNode,
        span2: DomNode;
    beforeEach(() => {
        ({ sync, dom, vDom, vP1, vP2, vSpan1, span1, vSpan2, span2 } =
            mockSyncronizer());
    });
    afterEach(() => {
        sync.checkSync();
    });

    test("format", () => {
        sync.format(vSpan1, TextFormat.BOLD);
        sync.format(vSpan1, TextFormat.ITALIC);
        sync.format(vSpan1, TextFormat.UNDERLINE);
        expect(span1.getElement()).toHaveStyle("font-weight: bold");
        expect(span1.getElement()).toHaveStyle("font-style: italic");
        expect(span1.getElement()).toHaveStyle("text-decoration: underline");
    });
});
